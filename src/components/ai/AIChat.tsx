
import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, User, Send, Loader2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface AIChatProps {
  context?: string;
  suggestions?: string[];
}

const AIChat = ({ context, suggestions = [] }: AIChatProps) => {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Hello! I\'m your AI assistant. I can help you with document processing, analysis, and answer questions about your data. What would you like to know?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const defaultQuestions = [
    "How do I scan a document?",
    "What document types are supported?",
    "How can I organize my documents?",
    "Show me document statistics",
    "How to export my data?"
  ];

  const simulateAIResponse = (userMessage: string): string => {
    const responses = {
      'scan': 'To scan a document, go to the Scan Document page, start your camera, and capture images. Make sure you have good lighting and the document is clearly visible.',
      'document': 'The system supports various document types including IDs, passports, certificates, and custom documents. You can categorize them for better organization.',
      'organize': 'You can organize documents by type, date, priority, and custom tags. Use the Documents page to view and manage your collection.',
      'statistics': 'Check the Reports page for detailed statistics about your document collection, including counts by type, date ranges, and storage usage.',
      'export': 'You can export your data from the Settings page. Choose between JSON format for backup or specific document exports.',
      'default': 'I understand you\'re asking about our document management system. Could you be more specific about what you\'d like to know?'
    };

    const lowerMessage = userMessage.toLowerCase();
    for (const [key, response] of Object.entries(responses)) {
      if (lowerMessage.includes(key)) {
        return response;
      }
    }
    return responses.default;
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI processing time
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: simulateAIResponse(input),
        timestamp: new Date()
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

  return (
    <Card className="glass-card h-[600px] flex flex-col">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center text-xl">
          <Bot className="mr-2 text-docvault-accent" size={24} />
          AI Assistant
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
                  <span className="text-xs opacity-70 mt-1 block">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
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
          <div className="space-y-2">
            <p className="text-sm text-docvault-gray">Quick questions:</p>
            <div className="flex flex-wrap gap-2">
              {defaultQuestions.map((question, index) => (
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
            placeholder="Ask me anything about document management..."
            className="bg-docvault-dark/50 border-docvault-accent/30"
            disabled={isLoading}
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

export default AIChat;
