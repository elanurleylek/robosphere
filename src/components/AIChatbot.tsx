// src/components/AIChatbot.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, User, Send, Loader2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

// -------- CHATMESSAGE INTERFACE TANIMI BURADA OLMALI -------- //
interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}
// -------- CHATMESSAGE INTERFACE TANIMI SONU -------- //

const AIChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([ // <-- Hatanın olduğu 1. yer (Ln 15)
    {sender: 'ai', text: 'Merhaba! Ben Robotik Asistanınız. Robotik veya kurslarla ilgili ne öğrenmek istersiniz?'}
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { userInfo } = useAuth();

  useEffect(() => {
     if (isOpen && scrollAreaRef.current) {
       scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
     }
  }, [messages, isOpen]);

  const toggleChatbot = () => {
    setIsOpen(prev => !prev);
  };

  const handleSendMessage = async () => {
    const userMessageText = inputValue.trim();
    if (!userMessageText || isLoading) return;

    // if (!userInfo) {
    //     alert("Soru sormak için lütfen giriş yapın.");
    //     return;
    // }

    const newUserMessage: ChatMessage = { sender: 'user', text: userMessageText }; // <-- Hatanın olduğu 2. yer (Ln 43 civarı)
    setMessages(prev => [...prev, newUserMessage]);
    setInputValue('');
    setIsLoading(true);

    const historyForAPI = messages.slice(-6);

    try {
      const response = await fetch('http://localhost:5000/api/ai/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${userInfo?.token}`
        },
        body: JSON.stringify({
          question: userMessageText,
          history: historyForAPI
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.answer || 'AI yanıtında bir hata oluştu.');
      }

      if (data.answer) {
        setMessages(prev => [...prev, { sender: 'ai', text: data.answer }]);
      } else {
         setMessages(prev => [...prev, { sender: 'ai', text: 'Üzgünüm, bir şeyler ters gitti.' }]);
      }

    } catch (error) {
      console.error("AI Chat Hatası:", error);
      const errorMessage = error instanceof Error ? error.message : 'Bilinmeyen bir hata oluştu.';
      setMessages(prev => [...prev, { sender: 'ai', text: `Hata: ${errorMessage}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !isLoading) {
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={toggleChatbot}
        variant="default"
        className="fixed bottom-4 right-4 w-14 h-14 rounded-full shadow-xl z-50 flex items-center justify-center group"
        size="icon"
        aria-label="Robotik Asistanı Aç"
      >
        <Bot className="h-7 w-7 transition-transform group-hover:scale-110" />
      </Button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-80 h-[28rem] bg-card border rounded-lg shadow-xl flex flex-col z-50">
      <div className="p-3 border-b flex items-center justify-between bg-muted/50 rounded-t-lg">
        <h3 className="text-sm font-semibold flex items-center">
          <Bot className="h-4 w-4 mr-2" /> Robotik Asistan
        </h3>
        <Button onClick={toggleChatbot} variant="ghost" size="icon" aria-label="Chatbot'u Kapat">
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1 p-3" ref={scrollAreaRef}>
        <div className="space-y-3">
          {messages.map((message, index) => (
            <div
              key={index}
              className={cn(
                "flex items-start gap-2 text-sm",
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {message.sender === 'ai' && (
                <Bot className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              )}
              <div
                className={cn(
                  "px-3 py-2 rounded-lg max-w-[80%]",
                  message.sender === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                )}
              >
                {message.text}
              </div>
               {message.sender === 'user' && (
                 <User className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
               )}
            </div>
          ))}
          {isLoading && (
             <div className="flex items-center justify-start gap-2 text-sm">
               <Bot className="h-5 w-5 text-primary shrink-0 mt-0.5 animate-pulse" />
               <div className="bg-muted px-3 py-2 rounded-lg">
                  <Loader2 className="h-4 w-4 animate-spin" />
               </div>
             </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-3 border-t flex items-center gap-2">
        <Input
          placeholder="Bir soru sorun..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
          className="flex-1"
        />
        <Button onClick={handleSendMessage} disabled={isLoading || !inputValue.trim()} size="icon">
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
};

export default AIChatbot;