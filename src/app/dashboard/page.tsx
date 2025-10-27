'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Clapperboard, Heart, ShoppingBag } from 'lucide-react';
import { useUser } from '@/firebase';

import { Chatbot } from './forum/_components/chatbot';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ProfileCard } from './matches/_components/profile-card';

const featuredMatch = { name: "Juliana S.", location: "São Paulo, SP", interests: ["Yoga", "Culinária"], babyAge: "8 meses", avatar: PlaceHolderImages.find(p => p.id === 'avatar-2')!.imageUrl };

const featuredProduct = {
    title: "Carrinho de bebê semi-novo",
    price: 450.00,
    image: PlaceHolderImages.find(p => p.id === 'product-1')!,
    seller: { name: "Ana P.", avatar: PlaceHolderImages.find(p => p.id === 'avatar-2')! }
};

const featuredArticle = {
    title: "Como lidar com a culpa materna: 5 dicas práticas",
    description: "Aprenda a reconhecer e a lidar com um dos sentimentos mais comuns na maternidade.",
    image: PlaceHolderImages.find(p => p.id === 'content-1')!,
    category: "Autoajuda"
};


export default function Dashboard() {
  const { user } = useUser();
  const welcomeMessage = user?.displayName ? `Bem-vinda, ${user.displayName.split(' ')[0]}!` : 'Bem-vinda!';

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          {welcomeMessage}
        </h1>
        <p className="text-muted-foreground">
          Sua comunidade de fé e acolhimento.
        </p>
      </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="md:col-span-2">
            <h2 className="font-headline text-2xl font-bold mb-4">Converse com a MãeIA</h2>
            <Chatbot />
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
                        <ShoppingBag className="text-primary"/> Brechó da Comunidade
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div className="relative aspect-video rounded-lg overflow-hidden">
                        <Image src={featuredProduct.image.imageUrl} alt={featuredProduct.image.description} fill className="object-cover" />
                    </div>
                    <h3 className="font-semibold">{featuredProduct.title}</h3>
                     <Button asChild className="w-full">
                        <Link href="/dashboard/loja">
                            Ver na Loja <ArrowRight className="ml-2" />
                        </Link>
                    </Button>
                </CardContent>
            </Card>

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
        </div>

      </div>
    </div>
  );
}
