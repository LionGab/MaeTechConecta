'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Play,
  Square,
  Clock,
  TrendingUp,
  AlertTriangle,
  Trash2,
  Phone,
  CheckCircle
} from 'lucide-react';

interface Contraction {
  id: string;
  startTime: Date;
  endTime?: Date;
  duration?: number; // in seconds
}

export default function ContracoesPage() {
  const [contractions, setContractions] = useState<Contraction[]>([]);
  const [currentContraction, setCurrentContraction] = useState<Contraction | null>(null);
  const [timer, setTimer] = useState(0);
  const [isActive, setIsActive] = useState(false);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && currentContraction) {
      interval = setInterval(() => {
        const elapsed = Math.floor((new Date().getTime() - currentContraction.startTime.getTime()) / 1000);
        setTimer(elapsed);
      }, 1000);
    } else {
      if (interval) clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, currentContraction]);

  const startContraction = () => {
    const newContraction: Contraction = {
      id: Date.now().toString(),
      startTime: new Date(),
    };
    setCurrentContraction(newContraction);
    setIsActive(true);
    setTimer(0);
  };

  const stopContraction = () => {
    if (currentContraction) {
      const endTime = new Date();
      const duration = Math.floor((endTime.getTime() - currentContraction.startTime.getTime()) / 1000);
      
      const completedContraction: Contraction = {
        ...currentContraction,
        endTime,
        duration,
      };

      setContractions(prev => [completedContraction, ...prev]);
      setCurrentContraction(null);
      setIsActive(false);
      setTimer(0);
    }
  };

  const deleteContraction = (id: string) => {
    setContractions(prev => prev.filter(c => c.id !== id));
  };

  const clearAll = () => {
    if (confirm('Deseja limpar todos os registros?')) {
      setContractions([]);
    }
  };

  // Calculate statistics
  const getStatistics = () => {
    if (contractions.length < 2) return null;

    const durations = contractions.map(c => c.duration || 0);
    const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length;

    const intervals: number[] = [];
    for (let i = 0; i < contractions.length - 1; i++) {
      const interval = Math.floor(
        (contractions[i].startTime.getTime() - contractions[i + 1].startTime.getTime()) / 1000
      );
      intervals.push(interval);
    }

    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;

    return {
      avgDuration,
      avgInterval,
      count: contractions.length,
    };
  };

  const stats = getStatistics();

  // Check if it's time to go to hospital (5-1-1 rule: contractions 5 min apart, lasting 1 min, for 1 hour)
  const shouldGoToHospital = () => {
    if (!stats) return false;
    
    // Contractions lasting at least 45-60 seconds
    const longDuration = stats.avgDuration >= 45;
    
    // Contractions 5 minutes or less apart
    const closeInterval = stats.avgInterval <= 300;
    
    // At least 12 contractions (roughly 1 hour if 5 min apart)
    const enoughCount = stats.count >= 12;

    return longDuration && closeInterval && enoughCount;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Cronômetro de Contrações
        </h1>
        <p className="text-muted-foreground">
          Monitore suas contrações para saber quando ir ao hospital
        </p>
      </div>

      {/* Hospital Alert */}
      {shouldGoToHospital() && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertTitle className="text-red-900 font-bold">Hora de ir ao hospital!</AlertTitle>
          <AlertDescription className="text-red-800">
            Suas contrações estão regulares e próximas. Ligue para seu médico e vá ao hospital.
          </AlertDescription>
          <Button className="mt-3 bg-red-600 hover:bg-red-700" size="sm">
            <Phone className="mr-2 h-4 w-4" />
            Ligar para Emergência
          </Button>
        </Alert>
      )}

      {/* Timer Card */}
      <Card className="border-primary/20">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-bold">
            {formatTime(timer)}
          </CardTitle>
          <CardDescription>
            {isActive ? 'Contração em andamento...' : 'Pressione iniciar quando sentir uma contração'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            {!isActive ? (
              <Button 
                onClick={startContraction}
                className="w-full h-16 text-lg"
              >
                <Play className="mr-2 h-6 w-6" />
                Iniciar Contração
              </Button>
            ) : (
              <Button 
                onClick={stopContraction}
                variant="destructive"
                className="w-full h-16 text-lg"
              >
                <Square className="mr-2 h-6 w-6" />
                Parar Contração
              </Button>
            )}
          </div>

          {currentContraction && (
            <div className="text-center text-sm text-muted-foreground">
              Iniciado às {formatDateTime(currentContraction.startTime)}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Statistics */}
      {stats && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Estatísticas da Sessão
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{stats.count}</div>
                <div className="text-xs text-muted-foreground">Contrações</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{formatTime(Math.floor(stats.avgDuration))}</div>
                <div className="text-xs text-muted-foreground">Duração Média</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{formatTime(Math.floor(stats.avgInterval))}</div>
                <div className="text-xs text-muted-foreground">Intervalo Médio</div>
              </div>
            </div>

            {/* Guidelines */}
            <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/10">
              <p className="text-sm font-medium mb-2">📋 Regra 5-1-1:</p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li className="flex items-center gap-2">
                  <CheckCircle className={`h-3 w-3 ${stats.avgInterval <= 300 ? 'text-green-600' : 'text-gray-400'}`} />
                  Contrações a cada 5 minutos ou menos
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className={`h-3 w-3 ${stats.avgDuration >= 45 ? 'text-green-600' : 'text-gray-400'}`} />
                  Durando 1 minuto ou mais
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className={`h-3 w-3 ${stats.count >= 12 ? 'text-green-600' : 'text-gray-400'}`} />
                  Por 1 hora consecutiva
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Contraction History */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Histórico de Contrações
            </CardTitle>
            {contractions.length > 0 && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={clearAll}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Limpar
              </Button>
            )}
          </div>
          <CardDescription>
            {contractions.length} contrações registradas
          </CardDescription>
        </CardHeader>
        <CardContent>
          {contractions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Nenhuma contração registrada ainda</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {contractions.map((contraction, index) => {
                const nextContraction = contractions[index + 1];
                const interval = nextContraction 
                  ? Math.floor((contraction.startTime.getTime() - nextContraction.startTime.getTime()) / 1000)
                  : null;

                return (
                  <div 
                    key={contraction.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">#{contractions.length - index}</Badge>
                        <span className="text-sm font-medium">
                          {formatDateTime(contraction.startTime)}
                        </span>
                      </div>
                      <div className="flex gap-4 mt-1 text-xs text-muted-foreground">
                        <span>Duração: {formatTime(contraction.duration || 0)}</span>
                        {interval && <span>Intervalo: {formatTime(interval)}</span>}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteContraction(contraction.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Information Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quando ir ao hospital?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            <strong className="text-foreground">Primeira gravidez:</strong> Quando as contrações estiverem regulares, a cada 5 minutos, durando 1 minuto, por 1 hora (Regra 5-1-1).
          </p>
          <p>
            <strong className="text-foreground">Segunda gravidez ou mais:</strong> Vá ao hospital mais cedo, quando as contrações estiverem a cada 10 minutos.
          </p>
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              Vá imediatamente ao hospital se tiver: sangramento, perda de líquido, contrações muito fortes e dolorosas, ou se o bebê parar de se mexer.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
