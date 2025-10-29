'use client';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
 copilot/structure-nossa-maternidade-app
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, 
  Baby, 
  Activity, 
  Calendar,
  Clock,
  Sparkles,
  Heart,
  BookOpen,
  TrendingUp
} from 'lucide-react';

import { Chatbot } from './forum/_components/chatbot';

export default function Dashboard() {
  // Mock data - would come from user profile in production
  const currentWeek = 7;
  const trimester = 'Primeiro';
  const daysUntilDue = 229;
  const todayProgress = 40; // percentage of daily tasks completed

  const quickStats = [
    { label: 'Semana', value: currentWeek, icon: Baby, color: 'text-pink-600' },
    { label: 'Dias até parto', value: daysUntilDue, icon: Calendar, color: 'text-purple-600' },
    { label: 'Tarefas hoje', value: `${todayProgress}%`, icon: TrendingUp, color: 'text-blue-600' },
  ];

  const quickActions = [
    {
      title: 'Registrar Sintomas',
      description: 'Como você está se sentindo hoje?',
      icon: Activity,
      href: '/dashboard/sintomas',
      color: 'bg-green-100 text-green-700',
    },
    {
      title: 'Ver Jornada Completa',
      description: 'Acompanhe seu progresso semanal',
      icon: Baby,
      href: '/dashboard/jornada',
      color: 'bg-pink-100 text-pink-700',
    },
    {
      title: 'Conteúdo Educativo',
      description: 'Artigos e vídeos para você',
      icon: BookOpen,
      href: '/dashboard/content',
      color: 'bg-purple-100 text-purple-700',
    },
  ];

import { ArrowRight, BookOpen, Heart, ShoppingBag, MessagesSquare } from 'lucide-react';
import { useUser } from '@/firebase';
import imageData from '@/lib/placeholder-images.json';

const featuredMatch = { name: "Juliana S.", location: "São Paulo, SP", interests: ["Yoga", "Culinária"], babyAge: "8 meses", avatar: imageData.placeholderImages.find(p => p.id === 'avatar-2')!.imageUrl };

const featuredProduct = {
    title: "Carrinho de bebê semi-novo",
    price: 450.00,
    image: imageData.placeholderImages.find(p => p.id === 'product-1')!,
    seller: { name: "Ana P.", avatar: imageData.placeholderImages.find(p => p.id === 'avatar-2')! }
};

const featuredArticle = {
    title: "Como lidar com a culpa materna: 5 dicas práticas",
    description: "Aprenda a reconhecer e a lidar com um dos sentimentos mais comuns na maternidade.",
    image: imageData.placeholderImages.find(p => p.id === 'content-1')!,
    category: "Autoajuda"
};
 main

  const todayInsights = [
    {
      title: 'Dica do Dia',
      content: 'Beba pelo menos 2 litros de água hoje. A hidratação é essencial no primeiro trimestre!',
      icon: '💧',
    },
    {
      title: 'Marco da Semana 7',
      content: 'Seu bebê agora tem o tamanho de um mirtilo e está desenvolvendo características faciais.',
      icon: '🫐',
    },
  ];

 copilot/structure-nossa-maternidade-app
  return (
    <div className="space-y-8 pb-20">
      {/* Welcome Header */}
      <div className="text-center space-y-2">
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Bem-vinda, Mamãe! 💝
        </h1>
        <p className="text-muted-foreground">
          Semana {currentWeek} • {trimester} Trimestre
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        {quickStats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Card key={idx} className="text-center">
              <CardContent className="pt-4 pb-3 px-2">
                <Icon className={`h-6 w-6 mx-auto mb-2 ${stat.color}`} />
                <div className="text-xl font-bold">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Today's Insights */}
      <div className="space-y-3">
        {todayInsights.map((insight, idx) => (
          <Card key={idx} className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="p-4">
              <div className="flex gap-3">
                <div className="text-3xl">{insight.icon}</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm mb-1">{insight.title}</h3>
                  <p className="text-sm text-muted-foreground">{insight.content}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="space-y-3">
        <h2 className="font-headline text-xl font-bold">Ações Rápidas</h2>
        <div className="grid gap-3">
          {quickActions.map((action, idx) => {
            const Icon = action.icon;
            return (
              <Link key={idx} href={action.href}>
                <Card className="transition-all hover:border-primary hover:shadow-md">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-lg ${action.color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm">{action.title}</h3>
                        <p className="text-xs text-muted-foreground">{action.description}</p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}

export default function Dashboard() {
  const { user } = useUser();
  const welcomeMessage = user?.displayName ? `Bem-vinda de volta, ${user.displayName.split(' ')[0]}!` : 'Bem-vinda!';

  return (
    <div className="space-y-8">
      <div className="text-left">
        <h1 className="font-headline text-4xl font-bold tracking-tight">
          {welcomeMessage}
        </h1>
        <p className="text-muted-foreground mt-2">
          Explore sua comunidade de fé e acolhimento.
        </p>
      </div>

       <div className="space-y-6">
            <h2 className="font-headline text-2xl font-bold">Navegação Rápida</h2>
             <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                <Link href="/dashboard/matches" className="block">
                    <Card className="flex flex-col items-center justify-center text-center p-6 h-36 hover:bg-accent transition-colors">
                        <Heart className="h-10 w-10 text-primary mb-2" />
                        <span className="font-semibold">Conexões</span>
                    </Card>
                </Link>
                <Link href="/dashboard/jornada" className="block">
                    <Card className="flex flex-col items-center justify-center text-center p-6 h-36 hover:bg-accent transition-colors">
                        <BookOpen className="h-10 w-10 text-primary mb-2" />
                        <span className="font-semibold">Jornada</span>
                    </Card>
                </Link>
                 <Link href="/dashboard/forum" className="block">
                    <Card className="flex flex-col items-center justify-center text-center p-6 h-36 hover:bg-accent transition-colors">
                        <MessagesSquare className="h-10 w-10 text-primary mb-2" />
                        <span className="font-semibold">Comunidade</span>
                    </Card>
                </Link>
                 <Link href="/dashboard/loja" className="block">
                    <Card className="flex flex-col items-center justify-center text-center p-6 h-36 hover:bg-accent transition-colors">
                        <ShoppingBag className="h-10 w-10 text-primary mb-2" />
                        <span className="font-semibold">Loja</span>
                    </Card>
                </Link>
             </div>
 main
        </div>
      </div>

 copilot/structure-nossa-maternidade-app
      {/* NathIA Chatbot */}
      <div>
        <h2 className="font-headline text-xl font-bold mb-3 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Converse com a NathIA
        </h2>
        <Chatbot />
            
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-3 space-y-6">
                <h2 className="font-headline text-2xl font-bold">Para você</h2>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BookOpen className="text-primary"/> Artigo em Destaque
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col md:flex-row gap-6 items-center">
                        <div className="relative w-full md:w-1/3 aspect-video rounded-lg overflow-hidden">
                             <Image src={featuredArticle.image.imageUrl} alt={featuredArticle.image.description} fill className="object-cover" />
                        </div>
                        <div className="flex-1">
                             <h3 className="font-bold text-lg">{featuredArticle.title}</h3>
                            <p className="text-muted-foreground text-sm mt-1">{featuredArticle.description}</p>
                        </div>
                    </CardContent>
                    <CardFooter>
                         <Button asChild variant="outline">
                            <Link href="/dashboard/jornada">
                                Ler artigo <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
 main
      </div>

      {/* Additional Resources */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            Mais Recursos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Link href="/dashboard/contracoes">
            <Button variant="outline" className="w-full justify-between">
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Cronômetro de Contrações
              </span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/dashboard/forum">
            <Button variant="outline" className="w-full justify-between">
              <span className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                Comunidade de Mães
              </span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
