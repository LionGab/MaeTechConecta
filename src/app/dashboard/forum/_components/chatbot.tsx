'use client';

import { useState, useRef, useEffect, useTransition } from 'react';
import { Bot, Send, Loader2, Sparkles, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { answerCommonQuestions } from '@/ai/flows/answer-common-questions';
import { cn } from '@/lib/utils';
import imageData from '@/lib/placeholder-images.json';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  keyPoints?: string[];
  urgentCare?: boolean;
}

const assistantAvatar = imageData.placeholderImages.find(p => p.id === 'avatar-1');

// Trimester-specific suggested questions
const suggestedQuestions = {
  first: [
    "Estou com muito enjoo, o que posso fazer?",
    "É normal sentir tanto cansaço no início?",
    "Quando devo fazer a primeira ultrassom?",
    "Como lidar com a ansiedade no primeiro trimestre?",
    "Que vitaminas devo tomar agora?",
  ],
  second: [
    "Quando vou sentir o bebê se mexer?",
    "Exercícios seguros para o segundo trimestre?",
    "Como me preparar para o chá de bebê?",
    "É normal ter dores nas costas?",
    "Alimentação ideal nesta fase?",
  ],
  third: [
    "Quais são os sinais do trabalho de parto?",
    "Como preparar a bolsa da maternidade?",
    "Exercícios para facilitar o parto?",
    "Como fazer o plano de parto?",
    "É normal sentir ansiedade antes do parto?",
  ],
  postpartum: [
    "Dicas para amamentação?",
    "Como lidar com o baby blues?",
    "Sono do recém-nascido: o que esperar?",
    "Recuperação pós-parto: quanto tempo?",
    "Como pedir ajuda sem culpa?",
  ],
};

export function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isPending, startTransition] = useTransition();
  const [currentTrimester, setCurrentTrimester] = useState<'first' | 'second' | 'third' | 'postpartum'>('first');
  const [currentWeek, setCurrentWeek] = useState(7); // 1.5 months as per requirements
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = (question?: string) => {
    const messageText = question || input;
    if (!messageText.trim() || isPending) return;

    const userMessage: Message = { role: 'user', content: messageText };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    startTransition(async () => {
        setMessages((prev) => [...prev, { role: 'assistant', content: '...' }]);
        try {
            const result = await answerCommonQuestions({ 
              question: messageText,
              week: currentWeek,
              trimester: currentTrimester,
            });
            setMessages((prev) => {
                const newMessages = [...prev];
                const lastMessage = newMessages[newMessages.length - 1];
                if (lastMessage.role === 'assistant') {
                    lastMessage.content = result.answer;
                    lastMessage.keyPoints = result.keyPoints;
                    lastMessage.urgentCare = result.urgentCare;
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

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage();
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const currentQuestions = suggestedQuestions[currentTrimester];

  return (
    <div className="flex h-full max-h-[calc(100vh-200px)] flex-col rounded-xl border bg-card">
      <div className="flex items-center gap-3 border-b p-4">
        <Avatar className="h-10 w-10 border-2 border-primary">
            {assistantAvatar && <AvatarImage src={assistantAvatar.imageUrl} />}
            <AvatarFallback><Bot size={20} /></AvatarFallback>
        </Avatar>
        <div className="flex-1">
            <h3 className="font-headline text-lg font-semibold">NathIA</h3>
            <p className="text-sm text-muted-foreground">Sua amiga e mentora virtual</p>
        </div>
        <Badge variant="secondary" className="text-xs">
          Semana {currentWeek}
        </Badge>
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
                <div className="grid gap-1 rounded-lg bg-primary/5 p-3 border border-primary/10">
                    <p className="font-medium">Olá, querida! 💝</p>
                    <p>Sou a NathIA, sua amiga e mentora nesta jornada especial da maternidade. Estou aqui para te ouvir, apoiar e caminhar junto com você.</p>
                    <p className="mt-2">Você está na semana {currentWeek} - primeiro trimestre. Como você está se sentindo hoje?</p>
                </div>
            </div>
            
            {/* Suggested Questions */}
            <div className="space-y-2 pl-12">
              <p className="text-xs text-muted-foreground font-medium">Perguntas comuns nesta fase:</p>
              <div className="flex flex-wrap gap-2">
                {currentQuestions.slice(0, 3).map((question, idx) => (
                  <Button
                    key={idx}
                    variant="outline"
                    size="sm"
                    className="text-xs h-auto py-2 px-3 hover:bg-primary/10 hover:border-primary/20"
                    onClick={() => handleSendMessage(question)}
                  >
                    {question}
                  </Button>
                ))}
              </div>
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
                  'grid gap-2 rounded-lg p-3 max-w-[80%]',
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-background border'
                )}
              >
                {message.content === '...' ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="animate-spin h-4 w-4" />
                    <span className="text-muted-foreground">Pensando...</span>
                  </div>
                ) : (
                  <>
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    {message.keyPoints && message.keyPoints.length > 0 && (
                      <div className="mt-2 space-y-1 border-t pt-2">
                        <p className="text-xs font-medium flex items-center gap-1">
                          <Sparkles className="h-3 w-3" />
                          Pontos principais:
                        </p>
                        <ul className="text-xs space-y-1 pl-4 list-disc">
                          {message.keyPoints.map((point, idx) => (
                            <li key={idx}>{point}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {message.urgentCare && (
                      <Badge variant="destructive" className="w-fit text-xs">
                        ⚠️ Considere consultar seu médico
                      </Badge>
                    )}
                  </>
                )}
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
        <form onSubmit={handleFormSubmit} className="flex items-center gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite sua pergunta..."
            disabled={isPending}
            autoComplete="off"
            className="flex-1"
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
