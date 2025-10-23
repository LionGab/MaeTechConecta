import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Star, Heart, Award } from 'lucide-react';
import Link from 'next/link';


export default function PricingPage() {

  return (
    <div className="flex flex-col items-center">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="font-headline text-4xl font-bold tracking-tight md:text-5xl">
          Acesso completo à comunidade ClubNath
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Desbloqueie todos os recursos e aprofunde sua conexão com a fé e a comunidade por um valor acessível.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 w-full max-w-md">
          <Card className="flex flex-col border-primary ring-2 ring-primary shadow-lg">
            <div className="py-2 px-4 bg-primary text-primary-foreground text-center text-sm font-semibold rounded-t-lg">
                Nosso Plano
              </div>
            <CardHeader className="text-center">
              <CardTitle className="font-headline text-2xl">ClubNath Premium</CardTitle>
              <CardDescription>A experiência completa para sua jornada de mãe.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="text-center">
                <span className="text-5xl font-bold">R$29,90</span>
                <span className="text-muted-foreground">/mês</span>
              </div>
              <ul className="mt-8 space-y-4 text-muted-foreground">
                  <li className="flex items-start">
                    <Star className="h-5 w-5 text-primary mr-3 shrink-0 mt-1" />
                    <span>Matching social <span className="font-semibold text-foreground">ilimitado</span> com IA para encontrar mães com interesses em comum.</span>
                  </li>
                  <li className="flex items-start">
                    <Heart className="h-5 w-5 text-primary mr-3 shrink-0 mt-1" />
                    <span>Acesso a <span className="font-semibold text-foreground">grupos temáticos</span> (fitness, fé, rotina) para conexões profundas.</span>
                  </li>
                   <li className="flex items-start">
                    <Check className="h-5 w-5 text-primary mr-3 shrink-0 mt-1" />
                    <span><span className="font-semibold text-foreground">Diário pessoal</span> para journaling, reflexões e acompanhamento da sua jornada.</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-primary mr-3 shrink-0 mt-1" />
                    <span><span className="font-semibold text-foreground">Estudos bíblicos guiados</span> e conteúdo sobre fé.</span>
                  </li>
                   <li className="flex items-start">
                    <Award className="h-5 w-5 text-primary mr-3 shrink-0 mt-1" />
                    <span><span className="font-semibold text-foreground">Conteúdo exclusivo</span> e participação em lives com especialistas.</span>
                  </li>
              </ul>
            </CardContent>
            <CardFooter className="flex-col gap-4">
              <Button
                asChild
                className="w-full"
                size="lg"
              >
                <Link href="/dashboard">Assinar o Plano Premium</Link>
              </Button>
            </CardFooter>
          </Card>
      </div>
    </div>
  );
}
