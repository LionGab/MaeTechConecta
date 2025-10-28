'use client';

import { SymptomTracker } from '@/components/symptom-tracker';
import { WeeklyTracker } from '@/components/weekly-tracker';
import { useUserProfile } from '@/hooks/use-user-profile';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

export default function SintomasPage() {
  const { userProfile, hasPregnancyData } = useUserProfile();
  
  const trimester = userProfile?.pregnancyData?.currentTrimester || 1;
  const currentWeek = userProfile?.pregnancyData?.currentWeek || 6;
  const dueDate = userProfile?.pregnancyData?.dueDate 
    ? new Date(userProfile.pregnancyData.dueDate)
    : new Date(Date.now() + 240 * 24 * 60 * 60 * 1000);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-headline text-3xl font-bold">Tracker de Sintomas</h1>
        <p className="text-muted-foreground mt-1">
          Acompanhe como você está se sentindo ao longo da gestação
        </p>
      </div>

      {hasPregnancyData && (
        <WeeklyTracker 
          currentWeek={currentWeek}
          trimester={trimester}
          dueDate={dueDate}
        />
      )}

      <SymptomTracker />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Por que registrar sintomas?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h3 className="font-semibold">📊 Acompanhamento</h3>
              <p className="text-sm text-muted-foreground">
                Identifique padrões e entenda melhor as mudanças do seu corpo
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">👩‍⚕️ Consultas médicas</h3>
              <p className="text-sm text-muted-foreground">
                Compartilhe informações precisas com seu obstetra
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">💡 Insights</h3>
              <p className="text-sm text-muted-foreground">
                Receba dicas personalizadas baseadas nos seus sintomas
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">🧘‍♀️ Bem-estar</h3>
              <p className="text-sm text-muted-foreground">
                Aprenda a gerenciar desconfortos comuns da gestação
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
