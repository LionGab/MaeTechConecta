'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Baby, 
  Calendar, 
  Heart, 
  Activity, 
  BookOpen, 
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Sparkles,
  Clock
} from 'lucide-react';
import { calculateWeekFromDueDate, getTrimesterFromWeek, getDaysUntilDueDate } from '@/lib/pregnancy-types';

// Mock data - in production this would come from Firebase
const mockPregnancyProfile = {
  dueDate: '2025-06-15',
  lastPeriodDate: '2024-09-08',
  currentWeek: 7, // ~1.5 months pregnant as per the requirements
};

export default function JornadaPage() {
  const [currentWeek, setCurrentWeek] = useState(mockPregnancyProfile.currentWeek);
  const [daysUntilDue, setDaysUntilDue] = useState(0);
  const [trimester, setTrimester] = useState<'first' | 'second' | 'third'>('first');
  const [weekProgress, setWeekProgress] = useState(0);

  useEffect(() => {
    const dueDate = new Date(mockPregnancyProfile.dueDate);
    const week = calculateWeekFromDueDate(dueDate);
    const days = getDaysUntilDueDate(dueDate);
    const trim = getTrimesterFromWeek(week);
    
    setCurrentWeek(week);
    setDaysUntilDue(days);
    setTrimester(trim as 'first' | 'second' | 'third');
    
    // Calculate progress within current week (mock - would track actual days)
    const dayOfWeek = new Date().getDay();
    setWeekProgress((dayOfWeek / 7) * 100);
  }, []);

  const trimesterInfo = {
    first: { 
      color: 'bg-rose-100 text-rose-800', 
      label: '1º Trimestre',
      weeks: '1-13 semanas',
      focus: 'Desenvolvimento inicial e formação de órgãos'
    },
    second: { 
      color: 'bg-purple-100 text-purple-800', 
      label: '2º Trimestre',
      weeks: '14-27 semanas',
      focus: 'Crescimento rápido e movimentos do bebê'
    },
    third: { 
      color: 'bg-blue-100 text-blue-800', 
      label: '3º Trimestre',
      weeks: '28-40 semanas',
      focus: 'Preparação final e ganho de peso'
    },
  };

  const weeklyMilestones = [
    {
      week: 7,
      title: 'Desenvolvimento das características faciais',
      babySize: 'Tamanho de um mirtilo (~1cm)',
      changes: 'Seu bebê está desenvolvendo olhos, nariz e boca',
      motherTip: 'Náuseas matinais são comuns. Tente comer pequenas refeições frequentes.',
    },
    {
      week: 8,
      title: 'Formação dos dedos',
      babySize: 'Tamanho de um feijão (~1.6cm)',
      changes: 'Os dedos das mãos e pés estão se formando',
      motherTip: 'Mantenha-se hidratada e descanse sempre que possível.',
    },
  ];

  const currentMilestone = weeklyMilestones[0]; // Week 7 milestone

  const dailyTasks = [
    { id: 1, title: 'Tomar ácido fólico', completed: false, icon: '💊', category: 'health' },
    { id: 2, title: 'Beber 2L de água', completed: false, icon: '💧', category: 'health' },
    { id: 3, title: 'Registrar sintomas', completed: false, icon: '📝', category: 'health' },
    { id: 4, title: 'Caminhada leve 15min', completed: false, icon: '🚶‍♀️', category: 'exercise' },
    { id: 5, title: 'Lanche saudável', completed: false, icon: '🥗', category: 'nutrition' },
  ];

  const upcomingAppointments = [
    {
      id: 1,
      title: 'Primeira Ultrassom',
      date: '2025-11-15',
      type: 'Ultrassom transvaginal',
      daysUntil: 18,
    },
    {
      id: 2,
      title: 'Consulta Pré-natal',
      date: '2025-11-08',
      type: 'Check-up geral',
      daysUntil: 11,
    },
  ];

  const aiInsights = [
    {
      id: 1,
      type: 'tip',
      content: 'Náuseas são normais no primeiro trimestre. Experimente gengibre ou biscoitos salgados pela manhã.',
      priority: 'low',
    },
    {
      id: 2,
      type: 'reminder',
      content: 'Não se esqueça de agendar sua primeira ultrassom entre 6-9 semanas.',
      priority: 'medium',
    },
  ];

  return (
    <div className="space-y-6 pb-20">
      {/* Header Section */}
      <div className="space-y-2">
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Sua Jornada da Maternidade
        </h1>
        <p className="text-muted-foreground">
          Acompanhe cada momento especial da sua gestação
        </p>
      </div>

      {/* Pregnancy Overview Card */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Baby className="h-6 w-6 text-primary" />
                Semana {currentWeek} de 40
              </CardTitle>
              <CardDescription className="mt-1">
                <Badge className={trimesterInfo[trimester].color}>
                  {trimesterInfo[trimester].label}
                </Badge>
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary">{daysUntilDue}</div>
              <div className="text-sm text-muted-foreground">dias até o parto</div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Progresso da gestação</span>
              <span className="font-medium">{Math.round((currentWeek / 40) * 100)}%</span>
            </div>
            <Progress value={(currentWeek / 40) * 100} className="h-3" />
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <div className="text-muted-foreground">Data prevista</div>
              <div className="font-semibold">15 de Junho, 2025</div>
            </div>
            <div className="space-y-1">
              <div className="text-muted-foreground">Trimestre</div>
              <div className="font-semibold">{trimesterInfo[trimester].weeks}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Milestone */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Marco desta Semana
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg mb-2">{currentMilestone.title}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
              <Baby className="h-4 w-4" />
              <span>{currentMilestone.babySize}</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="bg-primary/5 p-3 rounded-lg">
              <div className="font-medium text-sm mb-1">Desenvolvimento do bebê</div>
              <p className="text-sm text-muted-foreground">{currentMilestone.changes}</p>
            </div>
            
            <div className="bg-accent p-3 rounded-lg">
              <div className="font-medium text-sm mb-1 flex items-center gap-1">
                <Heart className="h-4 w-4 text-primary" />
                Dica para você
              </div>
              <p className="text-sm text-muted-foreground">{currentMilestone.motherTip}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Daily Routine */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              Minha Rotina de Hoje
            </CardTitle>
            <Badge variant="secondary">0/{dailyTasks.length} completas</Badge>
          </div>
          <CardDescription>
            Tarefas personalizadas para o primeiro trimestre
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {dailyTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent transition-colors"
              >
                <div className="text-2xl">{task.icon}</div>
                <div className="flex-1">
                  <div className="font-medium text-sm">{task.title}</div>
                </div>
                <Button size="sm" variant="ghost">
                  Concluir
                </Button>
              </div>
            ))}
          </div>
          
          <Button className="w-full mt-4" variant="outline">
            <Activity className="mr-2 h-4 w-4" />
            Ver Rotina Completa
          </Button>
        </CardContent>
      </Card>

      {/* Upcoming Appointments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Próximas Consultas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {upcomingAppointments.map((apt) => (
              <div
                key={apt.id}
                className="flex items-center justify-between p-3 rounded-lg border bg-card"
              >
                <div className="space-y-1">
                  <div className="font-medium">{apt.title}</div>
                  <div className="text-sm text-muted-foreground">{apt.type}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">Em {apt.daysUntil} dias</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(apt.date).toLocaleDateString('pt-BR')}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <Button className="w-full mt-4" variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Gerenciar Consultas
          </Button>
        </CardContent>
      </Card>

      {/* AI Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Insights Personalizados
          </CardTitle>
          <CardDescription>
            Dicas da NathIA especialmente para você
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {aiInsights.map((insight) => (
              <div
                key={insight.id}
                className="flex gap-3 p-3 rounded-lg bg-primary/5 border border-primary/10"
              >
                <AlertCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">{insight.content}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Educational Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Conteúdo Recomendado
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-4 rounded-lg border bg-card hover:bg-accent transition-colors cursor-pointer">
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 space-y-1">
                  <h4 className="font-semibold text-sm">Primeiros sintomas da gravidez</h4>
                  <p className="text-xs text-muted-foreground">
                    Entenda o que é normal no primeiro trimestre
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>5 min de leitura</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 rounded-lg border bg-card hover:bg-accent transition-colors cursor-pointer">
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded">
                  <Heart className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 space-y-1">
                  <h4 className="font-semibold text-sm">Alimentação no primeiro trimestre</h4>
                  <p className="text-xs text-muted-foreground">
                    O que comer para nutrir você e seu bebê
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>7 min de leitura</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <Button className="w-full mt-4" variant="outline">
            Ver Toda Biblioteca
          </Button>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Button variant="outline" className="h-20 flex-col gap-2">
          <Activity className="h-5 w-5" />
          <span className="text-sm">Registrar Sintomas</span>
        </Button>
        <Button variant="outline" className="h-20 flex-col gap-2">
          <TrendingUp className="h-5 w-5" />
          <span className="text-sm">Ver Progresso</span>
        </Button>
      </div>
    </div>
  );
}
