'use client';

import { PersonalizedRoutine } from '@/components/personalized-routine';
import { WeeklyTracker } from '@/components/weekly-tracker';
import { useUserProfile } from '@/hooks/use-user-profile';

export default function RotinaPage() {
  const { userProfile, hasPregnancyData } = useUserProfile();
  
  const trimester = userProfile?.pregnancyData?.currentTrimester || 1;
  const currentWeek = userProfile?.pregnancyData?.currentWeek || 6;
  const dueDate = userProfile?.pregnancyData?.dueDate 
    ? new Date(userProfile.pregnancyData.dueDate)
    : new Date(Date.now() + 240 * 24 * 60 * 60 * 1000);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-headline text-3xl font-bold">Minha Rotina</h1>
        <p className="text-muted-foreground mt-1">
          Tarefas personalizadas para apoiar sua jornada gestacional
        </p>
      </div>

      {hasPregnancyData && (
        <WeeklyTracker 
          currentWeek={currentWeek}
          trimester={trimester}
          dueDate={dueDate}
        />
      )}

      <PersonalizedRoutine 
        trimester={trimester}
        currentStreak={userProfile?.gamification?.currentStreak}
        totalPoints={userProfile?.gamification?.totalPoints}
      />
    </div>
  );
}
