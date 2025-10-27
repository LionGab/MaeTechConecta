'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen, Heart, ShoppingBag, MessagesSquare } from 'lucide-react';
import { useUser } from '@/firebase';
import imageData from '@/lib/placeholder-images.json';

const featuredMatch = { name: "Juliana S.", location: "São Paulo, SP", interests: ["Yoga", "Culinária"], babyAge: "8 meses", avatar: imageData.placeholderImages.find(p => p.id === 'avatar-2')!.imageUrl };

const featuredProduct = {
    title: "Carrinho de bebê semi-novo",
    price: 450.00,
    image: imageData.placeholderImages.find(p => p.id === 'product-1')!,
    seller: { name: "Ana P.", avatar: imageData.placeholderImages.find(p => p.id === 'avatar-2')! }
};

const featuredArticle = {
    title: "Como lidar com a culpa materna: 5 dicas práticas",
    description: "Aprenda a reconhecer e a lidar com um dos sentimentos mais comuns na maternidade.",
    image: imageData.placeholderImages.find(p => p.id === 'content-1')!,
    category: "Autoajuda"
};


export default function Dashboard() {
  const { user } = useUser();
  const welcomeMessage = user?.displayName ? `Bem-vinda de volta, ${user.displayName.split(' ')[0]}!` : 'Bem-vinda!';

  return (
    <div className="space-y-8">
      <div className="text-left">
        <h1 className="font-headline text-4xl font-bold tracking-tight">
          {welcomeMessage}
        </h1>
        <p className="text-muted-foreground mt-2">
          Explore sua comunidade de fé e acolhimento.
        </p>
      </div>

       <div className="space-y-6">
            <h2 className="font-headline text-2xl font-bold">Navegação Rápida</h2>
             <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                <Link href="/dashboard/matches" className="block">
                    <Card className="flex flex-col items-center justify-center text-center p-6 h-36 hover:bg-accent transition-colors">
                        <Heart className="h-10 w-10 text-primary mb-2" />
                        <span className="font-semibold">Conexões</span>
                    </Card>
                </Link>
                <Link href="/dashboard/jornada" className="block">
                    <Card className="flex flex-col items-center justify-center text-center p-6 h-36 hover:bg-accent transition-colors">
                        <BookOpen className="h-10 w-10 text-primary mb-2" />
                        <span className="font-semibold">Jornada</span>
                    </Card>
                </Link>
                 <Link href="/dashboard/forum" className="block">
                    <Card className="flex flex-col items-center justify-center text-center p-6 h-36 hover:bg-accent transition-colors">
                        <MessagesSquare className="h-10 w-10 text-primary mb-2" />
                        <span className="font-semibold">Comunidade</span>
                    </Card>
                </Link>
                 <Link href="/dashboard/loja" className="block">
                    <Card className="flex flex-col items-center justify-center text-center p-6 h-36 hover:bg-accent transition-colors">
                        <ShoppingBag className="h-10 w-10 text-primary mb-2" />
                        <span className="font-semibold">Loja</span>
                    </Card>
                </Link>
             </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-3 space-y-6">
                <h2 className="font-headline text-2xl font-bold">Para você</h2>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BookOpen className="text-primary"/> Artigo em Destaque
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col md:flex-row gap-6 items-center">
                        <div className="relative w-full md:w-1/3 aspect-video rounded-lg overflow-hidden">
                             <Image src={featuredArticle.image.imageUrl} alt={featuredArticle.image.description} fill className="object-cover" />
                        </div>
                        <div className="flex-1">
                             <h3 className="font-bold text-lg">{featuredArticle.title}</h3>
                            <p className="text-muted-foreground text-sm mt-1">{featuredArticle.description}</p>
                        </div>
                    </CardContent>
                    <CardFooter>
                         <Button asChild variant="outline">
                            <Link href="/dashboard/jornada">
                                Ler artigo <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
      </div>
    </div>
  );
}
