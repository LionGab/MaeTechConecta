
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Clapperboard, Sparkles } from 'lucide-react';
import Link from 'next/link';

const journeyLinks = [
    {
        href: '/dashboard/content',
        icon: Clapperboard,
        title: 'Conteúdo Exclusivo',
        description: 'Notícias e artigos selecionados sobre o universo feminino.'
    },
    {
        href: '/dashboard/nath-inspira',
        icon: Sparkles,
        title: 'Nath Inspira',
        description: 'Reflexões e sabedorias de Nathália Valente para a sua jornada.'
    }
]

export default function JourneyPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-headline text-3xl font-bold">Sua Jornada</h1>
        <p className="text-muted-foreground mt-1">Explore os conteúdos que preparamos para você.</p>
      </div>

        <div className="grid gap-6">
            {journeyLinks.map((link) => {
                const Icon = link.icon;
                return (
                    <Link href={link.href} key={link.href} className="block">
                        <Card className="transition-all hover:border-primary hover:shadow-lg">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-primary/10 p-3 rounded-lg">
                                            <Icon className="h-6 w-6 text-primary" />
                                        </div>
                                        <div>
                                            <CardTitle className="font-headline text-xl">{link.title}</CardTitle>
                                            <CardDescription className="mt-1">{link.description}</CardDescription>
                                        </div>
                                    </div>
                                    <ArrowRight className="h-5 w-5 text-muted-foreground" />
                                </div>
                            </CardHeader>
                        </Card>
                    </Link>
                )
            })}
        </div>
    </div>
  );
}
