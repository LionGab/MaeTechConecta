'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Baby, Calendar, Heart } from 'lucide-react';
import { getContentByTrimester } from '@/lib/types/user-profile';

interface WeeklyTrackerProps {
  currentWeek: number;
  trimester: 1 | 2 | 3;
  dueDate: Date;
}

export function WeeklyTracker({ currentWeek, trimester, dueDate }: WeeklyTrackerProps) {
  const content = getContentByTrimester(trimester);
  const progressPercentage = (currentWeek / 40) * 100;
  const weeksRemaining = Math.max(0, 40 - currentWeek);
  const daysRemaining = weeksRemaining * 7;

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Baby className="h-6 w-6 text-primary" />
              Semana {currentWeek}
            </CardTitle>
            <CardDescription className="mt-1">
              {content.title} • {content.weekRange}
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-muted-foreground text-sm">
              <Calendar className="h-4 w-4" />
              <span>{weeksRemaining} semanas</span>
            </div>
            <div className="text-xs text-muted-foreground">
              (~{daysRemaining} dias restantes)
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progresso da gestação</span>
            <span className="font-semibold">{Math.round(progressPercentage)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Heart className="h-4 w-4 text-primary" />
            <span>Dicas para esta semana</span>
          </div>
          <ul className="space-y-2">
            {content.tips.map((tip, index) => (
              <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="pt-2 border-t">
          <div className="text-xs text-muted-foreground">
            <strong>Foco do trimestre:</strong> {content.focus.join(' • ')}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
