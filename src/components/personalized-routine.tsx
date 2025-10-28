'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Circle, Trophy, Flame } from 'lucide-react';
import { getRoutineTasksByTrimester, DailyRoutineTask } from '@/lib/types/user-profile';

interface PersonalizedRoutineProps {
  trimester: 1 | 2 | 3;
  currentStreak?: number;
  totalPoints?: number;
}

export function PersonalizedRoutine({ 
  trimester, 
  currentStreak = 0,
  totalPoints = 0 
}: PersonalizedRoutineProps) {
  const baseTasks = getRoutineTasksByTrimester(trimester);
  const [tasks, setTasks] = useState<DailyRoutineTask[]>(
    baseTasks.map(task => ({ ...task, completed: false }))
  );

  const completedTasks = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length;
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  const pointsToday = tasks.filter(t => t.completed).reduce((sum, t) => sum + t.points, 0);

  const toggleTask = (taskId: string) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === taskId 
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              Minha Rotina
            </CardTitle>
            <CardDescription className="mt-1">
              Tarefas personalizadas para o {trimester}º trimestre
            </CardDescription>
          </div>
          <div className="flex gap-4">
            {currentStreak > 0 && (
              <div className="flex items-center gap-1 bg-orange-100 dark:bg-orange-900/20 px-3 py-1 rounded-full">
                <Flame className="h-4 w-4 text-orange-500" />
                <span className="text-sm font-semibold text-orange-700 dark:text-orange-300">
                  {currentStreak} dias
                </span>
              </div>
            )}
            <div className="flex items-center gap-1 bg-primary/10 px-3 py-1 rounded-full">
              <Trophy className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-primary">
                {totalPoints + pointsToday} pts
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progresso de hoje</span>
            <span className="font-semibold">
              {completedTasks}/{totalTasks} concluídas
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        <div className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`
                flex items-start gap-3 p-3 rounded-lg border transition-all
                ${task.completed 
                  ? 'bg-primary/5 border-primary/20' 
                  : 'bg-card hover:bg-muted/50 border-border'
                }
              `}
            >
              <Checkbox
                id={task.id}
                checked={task.completed}
                onCheckedChange={() => toggleTask(task.id)}
                className="mt-1"
              />
              <div className="flex-1 min-w-0">
                <label
                  htmlFor={task.id}
                  className={`
                    flex items-center gap-2 font-medium cursor-pointer
                    ${task.completed ? 'line-through text-muted-foreground' : ''}
                  `}
                >
                  <span className="text-xl">{task.icon}</span>
                  <span>{task.title}</span>
                  {task.time && (
                    <span className="text-xs text-muted-foreground">
                      {task.time}
                    </span>
                  )}
                </label>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {task.description}
                </p>
              </div>
              <div className="flex items-center gap-1 text-xs font-medium text-primary">
                <Trophy className="h-3 w-3" />
                +{task.points}
              </div>
            </div>
          ))}
        </div>

        {progressPercentage === 100 && (
          <div className="p-4 bg-primary/10 rounded-lg text-center border border-primary/20">
            <div className="text-2xl mb-2">🎉</div>
            <p className="font-semibold text-primary">
              Parabéns! Você completou todas as tarefas de hoje!
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Ganhou +{pointsToday} pontos
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
