
import * as tf from '@tensorflow/tfjs';

export interface AIModel {
  id: string;
  name: string;
  type: 'ocr' | 'classification' | 'face-recognition' | 'custom';
  model: tf.LayersModel | null;
  metadata: {
    inputShape: number[];
    outputClasses?: string[];
    accuracy?: number;
  };
}

export interface TrainingConfig {
  batchSize: number;
  epochs: number;
  learningRate: number;
  validationSplit: number;
}

class OfflineAIService {
  private models: Map<string, AIModel> = new Map();
  private isInitialized = false;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Set TensorFlow.js backend
      await tf.ready();
      console.log('TensorFlow.js backend:', tf.getBackend());
      console.log('TensorFlow.js initialized successfully');
      
      this.isInitialized = true;
      
      // Load any saved models from database
      await this.loadSavedModels();
    } catch (error) {
      console.error('Failed to initialize AI service:', error);
      throw error;
    }
  }

  private async loadSavedModels(): Promise<void> {
    try {
      const { localDatabase } = await import('./LocalDatabase');
      await localDatabase.initialize();
      const savedModels = await localDatabase.getAIModels();
      
      for (const savedModel of savedModels) {
        try {
          // Convert ArrayBuffer back to model
          const modelArrayBuffer = savedModel.modelData;
          const modelArray = new Uint8Array(modelArrayBuffer);
          const modelBlob = new Blob([modelArray]);
          const modelUrl = URL.createObjectURL(modelBlob);
          
          const model = await tf.loadLayersModel(modelUrl);
          
          this.models.set(savedModel.id, {
            id: savedModel.id,
            name: savedModel.name,
            type: savedModel.type,
            model,
            metadata: savedModel.metadata
          });
          
          URL.revokeObjectURL(modelUrl);
          console.log(`Loaded model: ${savedModel.name}`);
        } catch (error) {
          console.error(`Failed to load model ${savedModel.name}:`, error);
        }
      }
    } catch (error) {
      console.error('Failed to load saved models:', error);
    }
  }

  async createCustomModel(
    name: string,
    inputShape: number[],
    outputClasses: string[]
  ): Promise<string> {
    const modelId = crypto.randomUUID();
    
    // Create a simple neural network model
    const model = tf.sequential({
      layers: [
        tf.layers.flatten({ inputShape: inputShape.slice(1) }),
        tf.layers.dense({ units: 128, activation: 'relu' }),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.dense({ units: 64, activation: 'relu' }),
        tf.layers.dense({ units: outputClasses.length, activation: 'softmax' })
      ]
    });

    model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy']
    });

    const aiModel: AIModel = {
      id: modelId,
      name,
      type: 'custom',
      model,
      metadata: {
        inputShape,
        outputClasses
      }
    };

    this.models.set(modelId, aiModel);
    await this.saveModel(aiModel);
    
    console.log(`Created custom model: ${name}`);
    return modelId;
  }

  async trainModel(
    modelId: string,
    trainingData: number[][],
    labels: number[][],
    config: TrainingConfig
  ): Promise<{ accuracy: number; loss: number }> {
    const aiModel = this.models.get(modelId);
    if (!aiModel || !aiModel.model) {
      throw new Error('Model not found');
    }

    // Convert training data to tensors
    const xs = tf.tensor2d(trainingData);
    const ys = tf.tensor2d(labels);

    console.log(`Training model ${aiModel.name} with ${trainingData.length} samples`);

    const history = await aiModel.model.fit(xs, ys, {
      batchSize: config.batchSize,
      epochs: config.epochs,
      validationSplit: config.validationSplit,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          console.log(`Epoch ${epoch + 1}: loss = ${logs?.loss?.toFixed(4)}, accuracy = ${logs?.acc?.toFixed(4)}`);
        }
      }
    });

    // Clean up tensors
    xs.dispose();
    ys.dispose();

    const finalLoss = history.history.loss[history.history.loss.length - 1] as number;
    const finalAccuracy = history.history.acc[history.history.acc.length - 1] as number;

    // Update model metadata
    aiModel.metadata.accuracy = finalAccuracy;
    await this.saveModel(aiModel);

    console.log(`Training completed. Final accuracy: ${finalAccuracy.toFixed(4)}`);

    return {
      accuracy: finalAccuracy,
      loss: finalLoss
    };
  }

  async predict(modelId: string, inputData: number[]): Promise<{ predictions: number[]; confidence: number }> {
    const aiModel = this.models.get(modelId);
    if (!aiModel || !aiModel.model) {
      throw new Error('Model not found');
    }

    // Reshape input data according to model's expected input shape
    const inputTensor = tf.tensor(inputData, aiModel.metadata.inputShape);
    
    const prediction = aiModel.model.predict(inputTensor) as tf.Tensor;
    const predictionData = await prediction.data();
    
    // Clean up tensors
    inputTensor.dispose();
    prediction.dispose();

    const predictions = Array.from(predictionData);
    const confidence = Math.max(...predictions);

    return { predictions, confidence };
  }

  async processImage(imageData: string): Promise<{ text?: string; classification?: string; confidence: number }> {
    // Simple image processing - can be enhanced with specific models
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = async () => {
        try {
          // Convert image to tensor
          const tensor = tf.browser.fromPixels(img)
            .resizeNearestNeighbor([224, 224])
            .toFloat()
            .div(tf.scalar(255.0))
            .expandDims();

          // Simple document classification based on image characteristics
          const pixels = await tensor.data();
          const brightness = Array.from(pixels).reduce((sum, val) => sum + val, 0) / pixels.length;
          
          let classification = 'document';
          if (brightness > 0.8) classification = 'passport';
          else if (brightness < 0.3) classification = 'id-card';
          
          tensor.dispose();
          
          resolve({
            classification,
            confidence: 0.85,
            text: 'OCR functionality will be enhanced with specific models'
          });
        } catch (error) {
          console.error('Image processing error:', error);
          resolve({ confidence: 0, classification: 'unknown' });
        }
      };
      img.src = imageData;
    });
  }

  private async saveModel(aiModel: AIModel): Promise<void> {
    if (!aiModel.model) return;

    try {
      // Save model using a custom handler to get the data properly
      const saveHandler = {
        save: async (modelArtifacts: tf.io.ModelArtifacts) => {
          // Create a combined data structure for storage
          const modelJson = JSON.stringify(modelArtifacts.modelTopology);
          const weightsData = modelArtifacts.weightData;
          
          if (!weightsData) {
            throw new Error('No weight data found');
          }
          
          // Handle WeightData which can be ArrayBuffer or ArrayBuffer[]
          let combinedWeightsBuffer: ArrayBuffer;
          if (Array.isArray(weightsData)) {
            // Concatenate multiple ArrayBuffers
            const totalLength = weightsData.reduce((sum, buffer) => sum + buffer.byteLength, 0);
            combinedWeightsBuffer = new ArrayBuffer(totalLength);
            const uint8View = new Uint8Array(combinedWeightsBuffer);
            let offset = 0;
            for (const buffer of weightsData) {
              uint8View.set(new Uint8Array(buffer), offset);
              offset += buffer.byteLength;
            }
          } else {
            combinedWeightsBuffer = weightsData;
          }
          
          const combinedData = new Uint8Array(modelJson.length + combinedWeightsBuffer.byteLength + 4);
          const jsonLengthView = new DataView(combinedData.buffer, 0, 4);
          jsonLengthView.setUint32(0, modelJson.length);
          
          const encoder = new TextEncoder();
          combinedData.set(encoder.encode(modelJson), 4);
          combinedData.set(new Uint8Array(combinedWeightsBuffer), 4 + modelJson.length);

          const { localDatabase } = await import('./LocalDatabase');
          await localDatabase.saveAIModel({
            id: aiModel.id,
            name: aiModel.name,
            type: aiModel.type,
            modelData: combinedData.buffer,
            metadata: aiModel.metadata
          });

          console.log(`Model ${aiModel.name} saved to database`);
          
          return {
            modelArtifactsInfo: {
              dateSaved: new Date(),
              modelTopologyType: 'JSON' as const
            }
          };
        }
      };

      await aiModel.model.save(tf.io.withSaveHandler(saveHandler.save));
    } catch (error) {
      console.error('Failed to save model:', error);
    }
  }

  getAvailableModels(): AIModel[] {
    return Array.from(this.models.values());
  }

  async deleteModel(modelId: string): Promise<void> {
    const aiModel = this.models.get(modelId);
    if (aiModel?.model) {
      aiModel.model.dispose();
    }
    
    this.models.delete(modelId);
    
    const { localDatabase } = await import('./LocalDatabase');
    await localDatabase.deleteAIModel(modelId);
    
    console.log(`Model ${modelId} deleted`);
  }

  getModelInfo(modelId: string): AIModel | null {
    return this.models.get(modelId) || null;
  }
}

export const offlineAI = new OfflineAIService();
