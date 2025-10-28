'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Clapperboard, Heart, BookOpen, Users } from 'lucide-react';

import { Chatbot } from './forum/_components/chatbot';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ProfileCard } from './matches/_components/profile-card';
import { WeeklyTracker } from '@/components/weekly-tracker';
import { PersonalizedRoutine } from '@/components/personalized-routine';
import { useUserProfile } from '@/hooks/use-user-profile';

const featuredMatch = { name: "Juliana S.", location: "São Paulo, SP", interests: ["Yoga", "Culinária"], babyAge: "8 meses", avatar: PlaceHolderImages.find(p => p.id === 'avatar-2')!.imageUrl };

const featuredArticle = {
    title: "Como lidar com a culpa materna: 5 dicas práticas",
    description: "Aprenda a reconhecer e a lidar com um dos sentimentos mais comuns na maternidade.",
    image: PlaceHolderImages.find(p => p.id === 'content-1')!,
    category: "Autoajuda"
};


export default function Dashboard() {
  const { userProfile, hasPregnancyData } = useUserProfile();
  
  // Default to first trimester if no pregnancy data
  const trimester = userProfile?.pregnancyData?.currentTrimester || 1;
  const currentWeek = userProfile?.pregnancyData?.currentWeek || 6;
  const dueDate = userProfile?.pregnancyData?.dueDate 
    ? new Date(userProfile.pregnancyData.dueDate)
    : new Date(Date.now() + 240 * 24 * 60 * 60 * 1000); // ~8 months from now
  const displayName = userProfile?.displayName || 'Mamãe';
  const showCommercial = userProfile?.preferences?.showCommercialContent ?? false;
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Bem-vinda, {displayName}!
        </h1>
        <p className="text-muted-foreground">
          Sua comunidade de apoio e acolhimento.
        </p>
      </div>

      {/* Weekly Pregnancy Tracker */}
      {hasPregnancyData && (
        <WeeklyTracker 
          currentWeek={currentWeek}
          trimester={trimester}
          dueDate={dueDate}
        />
      )}

      {/* Personalized Daily Routine */}
      <PersonalizedRoutine 
        trimester={trimester}
        currentStreak={userProfile?.gamification?.currentStreak}
        totalPoints={userProfile?.gamification?.totalPoints}
      />

       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="md:col-span-2">
            <h2 className="font-headline text-2xl font-bold mb-4">Converse com a NathIA</h2>
            <Chatbot trimester={trimester} />
        </div>

        <div className="space-y-6">
            <h2 className="font-headline text-2xl font-bold">Sua Jornada</h2>
             <Card className="flex flex-col">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Heart className="text-primary"/> Conexões de Fé
                    </CardTitle>
                    <CardDescription>Encontramos um novo perfil para você.</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                    <ProfileCard match={featuredMatch} />
                </CardContent>
             </Card>
        </div>

        <div className="space-y-6">
            <h2 className="font-headline text-2xl font-bold">Destaques</h2>
            
             <Card>
                <CardHeader>
                     <CardTitle className="flex items-center gap-2">
                        <Clapperboard className="text-primary"/> Conteúdo Exclusivo
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div className="relative aspect-video rounded-lg overflow-hidden">
                        <Image src={featuredArticle.image.imageUrl} alt={featuredArticle.image.description} fill className="object-cover" />
                    </div>
                    <h3 className="font-semibold">{featuredArticle.title}</h3>
                     <Button asChild className="w-full">
                        <Link href="/dashboard/content">
                           Ler Artigo <ArrowRight className="ml-2" />
                        </Link>
                    </Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                     <CardTitle className="flex items-center gap-2">
                        <BookOpen className="text-primary"/> Recursos Úteis
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <Button asChild variant="outline" className="w-full justify-start">
                        <Link href="/dashboard/jornada">
                            <Users className="mr-2 h-4 w-4" />
                            Comunidade e Fórum
                        </Link>
                    </Button>
                    {showCommercial && (
                      <Button asChild variant="outline" className="w-full justify-start">
                          <Link href="/dashboard/loja">
                              Loja e Marketplace
                          </Link>
                      </Button>
                    )}
                </CardContent>
            </Card>
        </div>

      </div>
    </div>
  );
}
