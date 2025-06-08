
import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Bot, User, Send, Loader2, Brain, Zap, Globe } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { realAIService } from '@/services/RealAIService';

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
  enableDeepSec?: boolean;
}

const AdvancedAIChat = ({ enableDeepSec = true }: AdvancedAIChatProps) => {
  const { t, language } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialize with greeting
  useEffect(() => {
    const greeting = language === 'ar' 
      ? 'مرحباً! أنا مساعد الذكاء الاصطناعي المدعوم بتقنية DeepSec. يمكنني مساعدتك في تحليل المستندات والإجابة على أسئلتك باللغة العربية أو الإنجليزية.'
      : 'Hello! I\'m your AI assistant powered by DeepSec technology. I can help you with document analysis and answer questions in both Arabic and English.';
    
    setMessages([{
      id: '1',
      type: 'ai',
      content: greeting,
      timestamp: new Date(),
      language: language,
      confidence: 0.98,
      aiModel: enableDeepSec ? 'DeepSec-Advanced' : 'Standard-AI'
    }]);
  }, [language, enableDeepSec]);

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
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      // Use real AI service
      const aiResponse = await realAIService.processText(currentInput, language);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse.text,
        timestamp: new Date(),
        language: language,
        confidence: aiResponse.confidence,
        aiModel: aiResponse.model
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('AI response error:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: language === 'ar' 
          ? 'عذراً، حدث خطأ في معالجة طلبك. يرجى المحاولة مرة أخرى.'
          : 'Sorry, there was an error processing your request. Please try again.',
        timestamp: new Date(),
        language: language,
        confidence: 0.5,
        aiModel: 'Error-Handler'
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickQuestions = language === 'ar' 
    ? ["كيف أمسح مستند؟", "ما هي أنواع المستندات المدعومة؟", "كيف أدرب نموذج AI؟"]
    : ["How do I scan a document?", "What document types are supported?", "How to train an AI model?"];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <Card className="glass-card h-[500px] flex flex-col">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center">
            <Bot className="mr-2 text-docvault-accent" size={20} />
            {language === 'ar' ? 'مساعد AI متقدم' : 'Advanced AI Assistant'}
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-docvault-accent/30 text-xs">
              <Globe className="mr-1" size={10} />
              {language === 'ar' ? 'عربي' : 'EN'}
            </Badge>
            {enableDeepSec && (
              <Badge className="bg-docvault-accent text-xs">
                <Brain className="mr-1" size={10} />
                DeepSec
              </Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col gap-3">
        {/* Messages */}
        <ScrollArea className="flex-1 pr-2" ref={scrollRef}>
          <div className="space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-2 ${
                  message.type === 'user' ? 'justify-end' : 'justify-start'
                }`}
                dir={message.language === 'ar' ? 'rtl' : 'ltr'}
              >
                {message.type === 'ai' && (
                  <div className="w-6 h-6 rounded-full bg-docvault-accent/20 flex items-center justify-center flex-shrink-0">
                    <Bot size={12} className="text-docvault-accent" />
                  </div>
                )}
                
                <div
                  className={`max-w-[75%] p-2 rounded-lg text-sm ${
                    message.type === 'user'
                      ? 'bg-docvault-accent text-white'
                      : 'bg-docvault-dark border border-docvault-accent/20'
                  }`}
                >
                  <p>{message.content}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs opacity-60">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                    {message.confidence && (
                      <div className="flex items-center gap-1">
                        <Zap size={8} className="text-docvault-accent" />
                        <span className="text-xs text-docvault-accent">
                          {Math.round(message.confidence * 100)}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                {message.type === 'user' && (
                  <div className="w-6 h-6 rounded-full bg-docvault-accent flex items-center justify-center flex-shrink-0">
                    <User size={12} className="text-white" />
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-2 justify-start">
                <div className="w-6 h-6 rounded-full bg-docvault-accent/20 flex items-center justify-center">
                  <Bot size={12} className="text-docvault-accent" />
                </div>
                <div className="bg-docvault-dark border border-docvault-accent/20 p-2 rounded-lg">
                  <Loader2 className="w-3 h-3 animate-spin" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Quick Questions */}
        {messages.length <= 1 && (
          <div className="space-y-2" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            <p className="text-xs text-docvault-gray">
              {language === 'ar' ? 'أسئلة سريعة:' : 'Quick questions:'}
            </p>
            <div className="flex flex-wrap gap-1">
              {quickQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setInput(question)}
                  className="text-xs border-docvault-accent/30 hover:bg-docvault-accent/10 h-7"
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
            placeholder={language === 'ar' ? 'اسأل عن المستندات...' : 'Ask about documents...'}
            className="bg-docvault-dark/50 border-docvault-accent/30 text-sm"
            disabled={isLoading}
            dir={language === 'ar' ? 'rtl' : 'ltr'}
          />
          <Button 
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            className="bg-docvault-accent hover:bg-docvault-accent/80"
            size="sm"
          >
            <Send size={14} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdvancedAIChat;
