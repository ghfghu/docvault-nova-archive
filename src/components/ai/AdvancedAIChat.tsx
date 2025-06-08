
import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Bot, User, Send, Loader2, Brain, Zap, Globe } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  language: 'en' | 'ar';
  confidence?: number;
  aiModel?: string;
}

interface AdvancedAIChatProps {
  context?: string;
  enableDeepSec?: boolean;
}

const AdvancedAIChat = ({ context, enableDeepSec = true }: AdvancedAIChatProps) => {
  const { t, language } = useLanguage();
  const { documents, wantedPersons } = useData();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiModel, setAiModel] = useState('DeepSec-Advanced');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialize with multilingual greeting
  useEffect(() => {
    const greeting = language === 'ar' 
      ? 'مرحباً! أنا مساعد الذكاء الاصطناعي المتقدم. يمكنني مساعدتك في تحليل المستندات، معالجة البيانات، والإجابة على أسئلتك باللغة العربية أو الإنجليزية. ما الذي تود معرفته؟'
      : 'Hello! I\'m your advanced AI assistant with DeepSec integration. I can help you with document analysis, data processing, and answer questions in both Arabic and English. What would you like to know?';
    
    setMessages([{
      id: '1',
      type: 'ai',
      content: greeting,
      timestamp: new Date(),
      language: language,
      confidence: 0.98,
      aiModel: 'DeepSec-Advanced'
    }]);
  }, [language]);

  const arabicQuestions = [
    "كيف يمكنني مسح مستند؟",
    "ما هي أنواع المستندات المدعومة؟",
    "كيف يمكنني تنظيم مستنداتي؟",
    "أظهر لي إحصائيات المستندات",
    "كيف يمكنني تصدير بياناتي؟",
    "ما هو DeepSec وكيف يعمل؟",
    "كيف يمكنني تدريب نماذج الذكاء الاصطناعي؟",
    "ما هي ميزات التعرف على الوجوه؟"
  ];

  const englishQuestions = [
    "How do I scan a document?",
    "What document types are supported?",
    "How can I organize my documents?",
    "Show me document statistics",
    "How to export my data?",
    "What is DeepSec and how does it work?",
    "How can I train AI models?",
    "What are the face recognition features?"
  ];

  const generateAdvancedResponse = (userMessage: string, userLanguage: 'en' | 'ar'): { content: string; confidence: number } => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Arabic responses
    const arabicResponses = {
      'مسح': {
        content: 'لمسح مستند، انتقل إلى صفحة "مسح المستند"، قم بتشغيل الكاميرا، والتقط صور واضحة. تأكد من وجود إضاءة جيدة وأن المستند مرئي بوضوح. يمكن لنظام DeepSec تحليل المستند تلقائياً واستخراج البيانات المهمة.',
        confidence: 0.95
      },
      'مستند': {
        content: 'يدعم النظام أنواع مختلفة من المستندات بما في ذلك بطاقات الهوية، جوازات السفر، الشهادات، والمستندات المخصصة. يمكنك تصنيفها لتنظيم أفضل باستخدام الذكاء الاصطناعي.',
        confidence: 0.92
      },
      'تنظيم': {
        content: 'يمكنك تنظيم المستندات حسب النوع، التاريخ، الأولوية، والعلامات المخصصة. استخدم صفحة المستندات لعرض وإدارة مجموعتك. نظام DeepSec يقترح تصنيفات ذكية تلقائياً.',
        confidence: 0.94
      },
      'إحصائيات': {
        content: `لديك حالياً ${documents.length} مستند و ${wantedPersons.length} شخص مطلوب في قاعدة البيانات. تحقق من صفحة التقارير للحصول على إحصائيات مفصلة حول مجموعة مستنداتك، بما في ذلك العد حسب النوع ونطاقات التاريخ.`,
        confidence: 0.97
      },
      'تصدير': {
        content: 'يمكنك تصدير بياناتك من صفحة الإعدادات. اختر بين تنسيق JSON للنسخ الاحتياطي أو تصدير مستندات محددة. جميع البيانات تُحفظ محلياً على جهازك.',
        confidence: 0.93
      },
      'deepsec': {
        content: 'DeepSec هو نظام ذكاء اصطناعي متقدم مدمج في التطبيق لمعالجة المستندات وتحليلها. يوفر ميزات مثل التعرف الضوئي على النصوص، تصنيف المستندات، والتعرف على الوجوه. يعمل بالكامل دون اتصال بالإنترنت.',
        confidence: 0.96
      },
      'تدريب': {
        content: 'يمكنك تدريب نماذج مخصصة للذكاء الاصطناعي من خلال صفحة "تدريب الذكاء الاصطناعي". ارفع بيانات التدريب، اختر نموذج، وابدأ عملية التدريب. النظام يوفر مراقبة في الوقت الفعلي للأداء.',
        confidence: 0.91
      }
    };

    // English responses
    const englishResponses = {
      'scan': {
        content: 'To scan a document, go to the Scan Document page, start your camera, and capture clear images. Ensure good lighting and that the document is clearly visible. DeepSec can automatically analyze and extract important data.',
        confidence: 0.95
      },
      'document': {
        content: 'The system supports various document types including IDs, passports, certificates, and custom documents. You can categorize them for better organization using AI suggestions.',
        confidence: 0.92
      },
      'organize': {
        content: 'You can organize documents by type, date, priority, and custom tags. Use the Documents page to view and manage your collection. DeepSec provides intelligent auto-categorization.',
        confidence: 0.94
      },
      'statistics': {
        content: `You currently have ${documents.length} documents and ${wantedPersons.length} wanted persons in your database. Check the Reports page for detailed statistics about your document collection, including counts by type and date ranges.`,
        confidence: 0.97
      },
      'export': {
        content: 'You can export your data from the Settings page. Choose between JSON format for backup or specific document exports. All data is stored locally on your device.',
        confidence: 0.93
      },
      'deepsec': {
        content: 'DeepSec is an advanced AI system integrated into the app for document processing and analysis. It provides features like OCR, document classification, and face recognition. It works completely offline.',
        confidence: 0.96
      },
      'training': {
        content: 'You can train custom AI models through the "AI Training" page. Upload training data, select a model, and start the training process. The system provides real-time performance monitoring.',
        confidence: 0.91
      }
    };

    // Choose response set based on language
    const responses = userLanguage === 'ar' ? arabicResponses : englishResponses;
    
    // Find matching response
    for (const [key, response] of Object.entries(responses)) {
      if (lowerMessage.includes(key)) {
        return response;
      }
    }
    
    // Default response
    const defaultResponse = userLanguage === 'ar' 
      ? {
          content: 'أفهم أنك تسأل عن نظام إدارة المستندات. هل يمكنك توضيح سؤالك أكثر؟ يمكنني مساعدتك في تحليل المستندات، معالجة البيانات، أو أي ميزة أخرى في النظام.',
          confidence: 0.85
        }
      : {
          content: 'I understand you\'re asking about our document management system. Could you be more specific about what you\'d like to know? I can help with document analysis, data processing, or any other system feature.',
          confidence: 0.85
        };
    
    return defaultResponse;
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date(),
      language: language
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate DeepSec processing with realistic delay
    setTimeout(() => {
      const response = generateAdvancedResponse(input, language);
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: response.content,
        timestamp: new Date(),
        language: language,
        confidence: response.confidence,
        aiModel: enableDeepSec ? 'DeepSec-Advanced' : 'Standard-AI'
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1000 + Math.random() * 2000);
  };

  const handleSuggestion = (suggestion: string) => {
    setInput(suggestion);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const currentQuestions = language === 'ar' ? arabicQuestions : englishQuestions;

  return (
    <Card className="glass-card h-[600px] flex flex-col">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between text-xl">
          <div className="flex items-center">
            <Bot className="mr-2 text-docvault-accent" size={24} />
            {language === 'ar' ? 'مساعد الذكاء الاصطناعي المتقدم' : 'Advanced AI Assistant'}
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-docvault-accent/30">
              <Globe className="mr-1" size={12} />
              {language === 'ar' ? 'عربي' : 'EN'}
            </Badge>
            {enableDeepSec && (
              <Badge className="bg-docvault-accent">
                <Brain className="mr-1" size={12} />
                DeepSec
              </Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col gap-4">
        {/* Messages */}
        <ScrollArea className="flex-1 pr-4" ref={scrollRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.type === 'user' ? 'justify-end' : 'justify-start'
                }`}
                dir={message.language === 'ar' ? 'rtl' : 'ltr'}
              >
                {message.type === 'ai' && (
                  <div className="w-8 h-8 rounded-full bg-docvault-accent/20 flex items-center justify-center flex-shrink-0">
                    <Bot size={16} className="text-docvault-accent" />
                  </div>
                )}
                
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-docvault-accent text-white'
                      : 'bg-docvault-dark border border-docvault-accent/20'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                    {message.confidence && (
                      <div className="flex items-center gap-1">
                        <Zap size={10} className="text-docvault-accent" />
                        <span className="text-xs text-docvault-accent">
                          {Math.round(message.confidence * 100)}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                {message.type === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-docvault-accent flex items-center justify-center flex-shrink-0">
                    <User size={16} className="text-white" />
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-docvault-accent/20 flex items-center justify-center">
                  <Bot size={16} className="text-docvault-accent" />
                </div>
                <div className="bg-docvault-dark border border-docvault-accent/20 p-3 rounded-lg">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Suggestions */}
        {messages.length <= 1 && (
          <div className="space-y-2" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            <p className="text-sm text-docvault-gray">
              {language === 'ar' ? 'أسئلة سريعة:' : 'Quick questions:'}
            </p>
            <div className="flex flex-wrap gap-2">
              {currentQuestions.slice(0, 4).map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSuggestion(question)}
                  className="text-xs border-docvault-accent/30 hover:bg-docvault-accent/10"
                >
                  {question}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder={language === 'ar' ? 'اسألني أي شيء عن إدارة المستندات...' : 'Ask me anything about document management...'}
            className="bg-docvault-dark/50 border-docvault-accent/30"
            disabled={isLoading}
            dir={language === 'ar' ? 'rtl' : 'ltr'}
          />
          <Button 
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            className="bg-docvault-accent hover:bg-docvault-accent/80"
          >
            <Send size={16} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdvancedAIChat;
