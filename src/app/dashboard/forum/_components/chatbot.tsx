'use client';

import { useState, useRef, useEffect, useTransition } from 'react';
import { Bot, Send, Loader2, Sparkles, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { answerCommonQuestions } from '@/ai/flows/answer-common-questions';
import { cn } from '@/lib/utils';
import imageData from '@/lib/placeholder-images.json';
import { getChatbotQuestionsByTrimester } from '@/lib/types/user-profile';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatbotProps {
  trimester?: 1 | 2 | 3;
}

const assistantAvatar = imageData.placeholderImages.find(p => p.id === 'avatar-1');

export function Chatbot({ trimester = 1 }: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isPending, startTransition] = useTransition();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const suggestedQuestions = getChatbotQuestionsByTrimester(trimester);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isPending) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    startTransition(async () => {
        setMessages((prev) => [...prev, { role: 'assistant', content: '...' }]);
        try {
            const result = await answerCommonQuestions({ question: input });
            setMessages((prev) => {
                const newMessages = [...prev];
                const lastMessage = newMessages[newMessages.length - 1];
                if (lastMessage.role === 'assistant') {
                    lastMessage.content = result.answer;
                }
                return newMessages;
            });
        } catch (error) {
             setMessages((prev) => {
                const newMessages = [...prev];
                const lastMessage = newMessages[newMessages.length - 1];
                if (lastMessage.role === 'assistant') {
                    lastMessage.content = 'Desculpe, não consegui processar sua pergunta. Tente novamente.';
                }
                return newMessages;
            });
        }
    });
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  return (
    <div className="flex h-full max-h-[calc(100vh-200px)] flex-col rounded-xl border bg-card">
      <div className="flex items-center gap-3 border-b p-4">
        <Avatar className="h-10 w-10 border-2 border-primary">
            {assistantAvatar && <AvatarImage src={assistantAvatar.imageUrl} />}
            <AvatarFallback><Bot size={20} /></AvatarFallback>
        </Avatar>
        <div>
            <h3 className="font-headline text-lg font-semibold">NathIA</h3>
            <p className="text-sm text-muted-foreground">Sua amiga e mentora virtual</p>
        </div>
      </div>
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.length === 0 && (
            <>
              <div className="flex items-start gap-4 text-sm">
                <Avatar className="h-8 w-8 border-2 border-primary">
                    {assistantAvatar && <AvatarImage src={assistantAvatar.imageUrl} />}
                    <AvatarFallback><Bot size={16} /></AvatarFallback>
                </Avatar>
                <div className="grid gap-2 rounded-lg bg-background p-3">
                    <p>Olá, querida! Sou a NathIA, sua amiga e mentora. Estou aqui para te ouvir, apoiar e caminharmos juntas. Como você está se sentindo hoje?</p>
                    <p className="text-xs text-muted-foreground mt-2">Você pode me perguntar sobre:</p>
                </div>
              </div>
              <div className="grid gap-2 ml-12">
                {suggestedQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="justify-start text-left h-auto py-2 px-3 text-sm"
                    onClick={() => {
                      setInput(question);
                      // Simulate form submission
                      const form = new Event('submit', { bubbles: true, cancelable: true });
                      document.querySelector('form')?.dispatchEvent(form);
                    }}
                  >
                    <Sparkles className="h-3 w-3 mr-2 shrink-0 text-primary" />
                    <span className="line-clamp-2">{question}</span>
                  </Button>
                ))}
              </div>
            </>
          )}
          {messages.map((message, index) => (
            <div
              key={index}
              className={cn(
                'flex items-start gap-4 text-sm',
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {message.role === 'assistant' && (
                <Avatar className="h-8 w-8 border-2 border-primary">
                    {assistantAvatar && <AvatarImage src={assistantAvatar.imageUrl} />}
                    <AvatarFallback><Bot size={16} /></AvatarFallback>
                </Avatar>
              )}
              <div
                className={cn(
                  'grid gap-1 rounded-lg p-3',
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-background'
                )}
              >
                {message.content === '...' ? <Loader2 className="animate-spin" /> : <p>{message.content}</p>}
              </div>
               {message.role === 'user' && (
                <Avatar className="h-8 w-8">
                    <AvatarFallback><User size={16}/></AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="border-t p-4">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite sua pergunta..."
            disabled={isPending}
            autoComplete="off"
          />
          <Button type="submit" size="icon" disabled={isPending || !input.trim()}>
            {isPending ? <Loader2 className="animate-spin" /> : <Send />}
            <span className="sr-only">Enviar</span>
          </Button>
        </form>
      </div>
    </div>
  );
}
