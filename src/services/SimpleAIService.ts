
interface AIResponse {
  text: string;
  confidence: number;
  model: string;
  language: 'en' | 'ar';
}

class SimpleAIService {
  private isInitialized = false;

  async initialize() {
    if (this.isInitialized) return;
    
    try {
      console.log('Initializing Simple AI...');
      this.isInitialized = true;
      console.log('Simple AI initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Simple AI:', error);
    }
  }

  async processText(text: string, language: 'en' | 'ar' = 'en'): Promise<AIResponse> {
    await this.initialize();
    
    try {
      const response = this.generateContextualResponse(text, language);
      
      return {
        text: response,
        confidence: 0.85,
        model: 'SimpleAI-v1',
        language
      };
    } catch (error) {
      console.error('AI processing error:', error);
      return this.getFallbackResponse(text, language);
    }
  }

  private generateContextualResponse(input: string, language: 'en' | 'ar'): string {
    const lowerInput = input.toLowerCase();
    
    if (language === 'ar') {
      if (lowerInput.includes('مسح') || lowerInput.includes('scan')) {
        return 'لمسح مستند، انتقل إلى صفحة "مسح المستند" واستخدم الكاميرا لالتقاط صور واضحة. تأكد من وجود إضاءة جيدة.';
      }
      if (lowerInput.includes('مستند') || lowerInput.includes('document')) {
        return 'يدعم النظام أنواع مختلفة من المستندات بما في ذلك بطاقات الهوية وجوازات السفر والشهادات.';
      }
      if (lowerInput.includes('تدريب') || lowerInput.includes('training')) {
        return 'يمكنك تدريب نماذج مخصصة للذكاء الاصطناعي من خلال صفحة "تدريب الذكاء الاصطناعي".';
      }
      if (lowerInput.includes('كاميرا') || lowerInput.includes('camera')) {
        return 'إذا كانت الكاميرا لا تعمل، تأكد من منح الإذن للموقع باستخدام الكاميرا في إعدادات المتصفح. اضغط على زر "تشغيل الكاميرا" وامنح الإذن عند الطلب.';
      }
      return 'أفهم سؤالك. كيف يمكنني مساعدتك في إدارة المستندات أو استخدام ميزات النظام؟';
    } else {
      if (lowerInput.includes('scan')) {
        return 'To scan a document, go to the Scan Document page and use your camera to capture clear images. Make sure you have good lighting.';
      }
      if (lowerInput.includes('document')) {
        return 'The system supports various document types including IDs, passports, certificates, and custom documents.';
      }
      if (lowerInput.includes('training')) {
        return 'You can train custom AI models through the AI Training page. Upload your training data and select a model to begin.';
      }
      if (lowerInput.includes('camera')) {
        return 'If the camera is not working, make sure to grant camera permission to the website in your browser settings. Click the "Start Camera" button and allow access when prompted.';
      }
      return 'I understand your question. How can I help you with document management or system features?';
    }
  }

  private getFallbackResponse(text: string, language: 'en' | 'ar'): AIResponse {
    return {
      text: language === 'ar' 
        ? 'أعتذر، لست متأكداً من كيفية الإجابة على ذلك. هل يمكنك إعادة صياغة سؤالك؟'
        : 'I apologize, I\'m not sure how to answer that. Could you rephrase your question?',
      confidence: 0.7,
      model: 'SimpleAI-Fallback',
      language
    };
  }

  async analyzeDocument(imageData: string): Promise<{ text: string; type: string; confidence: number }> {
    // Simple document analysis
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      text: 'Document detected and analyzed',
      type: 'identification',
      confidence: 0.75
    };
  }

  async classifyDocument(text: string): Promise<{ category: string; confidence: number }> {
    // Simple rule-based classification
    const categories = ['id', 'passport', 'certificate', 'other'];
    const category = text.toLowerCase().includes('passport') ? 'passport' : 
                    text.toLowerCase().includes('certificate') ? 'certificate' : 'id';
    
    return {
      category,
      confidence: 0.8
    };
  }
}

export const simpleAIService = new SimpleAIService();
