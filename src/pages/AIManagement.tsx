
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Brain, 
  Download, 
  Upload, 
  Trash2, 
  Play,
  Settings as SettingsIcon,
  Database,
  Zap,
  Eye,
  Target
} from 'lucide-react';
import { offlineAI, AIModel, TrainingConfig } from '@/services/OfflineAIService';
import { localDatabase } from '@/services/LocalDatabase';
import { toast } from '@/components/ui/use-toast';
import Layout from '@/components/Layout';

const AIManagement = () => {
  const [models, setModels] = useState<AIModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [isTraining, setIsTraining] = useState(false);
  
  // New model creation form
  const [newModelName, setNewModelName] = useState('');
  const [newModelType, setNewModelType] = useState('custom');
  const [outputClasses, setOutputClasses] = useState('');
  
  // Training configuration
  const [trainingConfig, setTrainingConfig] = useState<TrainingConfig>({
    batchSize: 32,
    epochs: 10,
    learningRate: 0.001,
    validationSplit: 0.2
  });

  useEffect(() => {
    initializeAI();
  }, []);

  const initializeAI = async () => {
    try {
      setIsLoading(true);
      await offlineAI.initialize();
      await localDatabase.initialize();
      
      const availableModels = offlineAI.getAvailableModels();
      setModels(availableModels);
      
      console.log('AI management initialized');
    } catch (error) {
      console.error('Failed to initialize AI:', error);
      toast({
        title: "AI Initialization Failed",
        description: "Failed to initialize AI services",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createNewModel = async () => {
    if (!newModelName.trim() || !outputClasses.trim()) {
      toast({
        title: "Invalid Input",
        description: "Please provide model name and output classes",
        variant: "destructive"
      });
      return;
    }

    try {
      const classes = outputClasses.split(',').map(c => c.trim()).filter(c => c);
      const inputShape = [1, 224, 224, 3]; // Default image input shape
      
      const modelId = await offlineAI.createCustomModel(
        newModelName,
        inputShape,
        classes
      );
      
      const updatedModels = offlineAI.getAvailableModels();
      setModels(updatedModels);
      
      // Reset form
      setNewModelName('');
      setOutputClasses('');
      
      toast({
        title: "Model Created",
        description: `Successfully created model: ${newModelName}`,
      });
    } catch (error) {
      console.error('Failed to create model:', error);
      toast({
        title: "Model Creation Failed",
        description: "Failed to create the AI model",
        variant: "destructive"
      });
    }
  };

  const trainModel = async (modelId: string) => {
    try {
      setIsTraining(true);
      setTrainingProgress(0);
      
      // Generate dummy training data for demonstration
      const trainingData: number[][] = [];
      const labels: number[][] = [];
      
      const model = models.find(m => m.id === modelId);
      if (!model || !model.metadata.outputClasses) return;
      
      const numClasses = model.metadata.outputClasses.length;
      const numSamples = 100;
      
      for (let i = 0; i < numSamples; i++) {
        // Generate dummy image data (flattened 224x224x3)
        const imageData = Array.from({ length: 224 * 224 * 3 }, () => Math.random());
        trainingData.push(imageData);
        
        // Generate random one-hot encoded labels
        const label = new Array(numClasses).fill(0);
        label[Math.floor(Math.random() * numClasses)] = 1;
        labels.push(label);
        
        // Update progress
        setTrainingProgress((i / numSamples) * 50);
      }
      
      // Train the model
      const result = await offlineAI.trainModel(modelId, trainingData, labels, trainingConfig);
      
      setTrainingProgress(100);
      
      // Update models list
      const updatedModels = offlineAI.getAvailableModels();
      setModels(updatedModels);
      
      toast({
        title: "Training Completed",
        description: `Model trained with ${result.accuracy.toFixed(2)} accuracy`,
      });
      
    } catch (error) {
      console.error('Training failed:', error);
      toast({
        title: "Training Failed",
        description: "Failed to train the model",
        variant: "destructive"
      });
    } finally {
      setIsTraining(false);
      setTrainingProgress(0);
    }
  };

  const deleteModel = async (modelId: string) => {
    if (!confirm('Are you sure you want to delete this model? This action cannot be undone.')) {
      return;
    }

    try {
      await offlineAI.deleteModel(modelId);
      const updatedModels = offlineAI.getAvailableModels();
      setModels(updatedModels);
      
      toast({
        title: "Model Deleted",
        description: "AI model has been deleted successfully",
      });
    } catch (error) {
      console.error('Failed to delete model:', error);
      toast({
        title: "Deletion Failed",
        description: "Failed to delete the model",
        variant: "destructive"
      });
    }
  };

  const testModel = async (modelId: string) => {
    try {
      // Generate dummy test data
      const testData = Array.from({ length: 224 * 224 * 3 }, () => Math.random());
      
      const result = await offlineAI.predict(modelId, testData);
      
      toast({
        title: "Model Test Result",
        description: `Confidence: ${(result.confidence * 100).toFixed(1)}%`,
      });
    } catch (error) {
      console.error('Model test failed:', error);
      toast({
        title: "Test Failed",
        description: "Failed to test the model",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Brain className="mx-auto mb-4 text-docvault-accent animate-pulse" size={48} />
            <p className="text-docvault-gray">Initializing AI Services...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto animate-fade-in">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-gradient flex items-center">
            <Brain className="mr-2 text-docvault-accent" size={24} />
            AI Model Management
          </h1>
          <p className="text-docvault-gray text-sm">
            Create, train, and manage your offline AI models for document processing
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Create New Model */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="mr-2" size={20} />
                Create New Model
              </CardTitle>
              <CardDescription>
                Create a custom AI model for your specific needs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="model-name">Model Name</Label>
                <Input
                  id="model-name"
                  value={newModelName}
                  onChange={(e) => setNewModelName(e.target.value)}
                  placeholder="e.g., Document Classifier"
                  className="bg-docvault-dark/50 border-docvault-accent/30"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="output-classes">Output Classes (comma-separated)</Label>
                <Textarea
                  id="output-classes"
                  value={outputClasses}
                  onChange={(e) => setOutputClasses(e.target.value)}
                  placeholder="e.g., passport, id_card, driver_license, document"
                  className="bg-docvault-dark/50 border-docvault-accent/30"
                />
              </div>
              
              <Button 
                onClick={createNewModel}
                className="w-full bg-docvault-accent hover:bg-docvault-accent/80"
                disabled={!newModelName.trim() || !outputClasses.trim()}
              >
                <Brain className="mr-2" size={16} />
                Create Model
              </Button>
            </CardContent>
          </Card>

          {/* Training Configuration */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <SettingsIcon className="mr-2" size={20} />
                Training Configuration
              </CardTitle>
              <CardDescription>
                Configure training parameters for your models
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="batch-size">Batch Size</Label>
                  <Input
                    id="batch-size"
                    type="number"
                    value={trainingConfig.batchSize}
                    onChange={(e) => setTrainingConfig(prev => ({ ...prev, batchSize: parseInt(e.target.value) || 32 }))}
                    className="bg-docvault-dark/50 border-docvault-accent/30"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="epochs">Epochs</Label>
                  <Input
                    id="epochs"
                    type="number"
                    value={trainingConfig.epochs}
                    onChange={(e) => setTrainingConfig(prev => ({ ...prev, epochs: parseInt(e.target.value) || 10 }))}
                    className="bg-docvault-dark/50 border-docvault-accent/30"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="learning-rate">Learning Rate</Label>
                  <Input
                    id="learning-rate"
                    type="number"
                    step="0.001"
                    value={trainingConfig.learningRate}
                    onChange={(e) => setTrainingConfig(prev => ({ ...prev, learningRate: parseFloat(e.target.value) || 0.001 }))}
                    className="bg-docvault-dark/50 border-docvault-accent/30"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="validation-split">Validation Split</Label>
                  <Input
                    id="validation-split"
                    type="number"
                    step="0.1"
                    min="0"
                    max="1"
                    value={trainingConfig.validationSplit}
                    onChange={(e) => setTrainingConfig(prev => ({ ...prev, validationSplit: parseFloat(e.target.value) || 0.2 }))}
                    className="bg-docvault-dark/50 border-docvault-accent/30"
                  />
                </div>
              </div>
              
              {isTraining && (
                <div className="space-y-2">
                  <Label>Training Progress</Label>
                  <Progress value={trainingProgress} className="h-2" />
                  <p className="text-sm text-docvault-gray">{trainingProgress.toFixed(0)}% complete</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Available Models */}
        <Card className="glass-card mt-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="mr-2" size={20} />
              Available Models ({models.length})
            </CardTitle>
            <CardDescription>
              Manage your trained AI models
            </CardDescription>
          </CardHeader>
          <CardContent>
            {models.length > 0 ? (
              <div className="space-y-4">
                {models.map((model) => (
                  <div key={model.id} className="p-4 border border-docvault-accent/20 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-lg">{model.name}</h3>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-docvault-accent/30"
                          onClick={() => testModel(model.id)}
                        >
                          <Eye className="mr-1" size={14} />
                          Test
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-docvault-accent/30"
                          onClick={() => trainModel(model.id)}
                          disabled={isTraining}
                        >
                          <Target className="mr-1" size={14} />
                          Train
                        </Button>
                        
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteModel(model.id)}
                          disabled={isTraining}
                        >
                          <Trash2 className="mr-1" size={14} />
                          Delete
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-docvault-accent">Type:</span>
                        <p className="text-docvault-gray capitalize">{model.type}</p>
                      </div>
                      
                      <div>
                        <span className="font-medium text-docvault-accent">Input Shape:</span>
                        <p className="text-docvault-gray">{model.metadata.inputShape?.join(' x ')}</p>
                      </div>
                      
                      <div>
                        <span className="font-medium text-docvault-accent">Accuracy:</span>
                        <p className="text-docvault-gray">
                          {model.metadata.accuracy ? `${(model.metadata.accuracy * 100).toFixed(1)}%` : 'Not trained'}
                        </p>
                      </div>
                    </div>
                    
                    {model.metadata.outputClasses && (
                      <div className="mt-2">
                        <span className="font-medium text-docvault-accent">Classes:</span>
                        <p className="text-docvault-gray text-sm">{model.metadata.outputClasses.join(', ')}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Brain size={48} className="mx-auto mb-4 text-docvault-accent/50" />
                <h3 className="text-xl font-bold text-gradient mb-2">No Models Available</h3>
                <p className="text-docvault-gray mb-4">
                  Create your first AI model to get started with offline intelligence
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AIManagement;
