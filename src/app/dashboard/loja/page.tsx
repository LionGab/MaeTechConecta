'use client';

import Image from 'next/image';
import Link from 'next/link';
import { PlusCircle, Search, Sparkles, TestTube2, PersonStanding } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ProductCard } from './_components/product-card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const products = [
  {
    title: "Carrinho de bebê semi-novo",
    price: 450.00,
    image: PlaceHolderImages.find(p => p.id === 'product-1')!,
    seller: { name: "Ana P.", avatar: PlaceHolderImages.find(p => p.id === 'avatar-2')! }
  },
  {
    title: "Berço de madeira com colchão",
    price: 700.00,
    image: PlaceHolderImages.find(p => p.id === 'product-2')!,
    seller: { name: "Juliana S.", avatar: PlaceHolderImages.find(p => p.id === 'avatar-3')! }
  },
  {
    title: "Kit mamadeiras",
    price: 80.00,
    image: PlaceHolderImages.find(p => p.id === 'product-3')!,
    seller: { name: "Fernanda L.", avatar: PlaceHolderImages.find(p => p.id === 'avatar-4')! }
  },
  {
    title: "Cadeirão de alimentação Chicco",
    price: 300.00,
    image: PlaceHolderImages.find(p => p.id === 'product-5')!,
    seller: { name: "Carla D.", avatar: PlaceHolderImages.find(p => p.id === 'avatar-1')! }
  }
];

const navaImage = PlaceHolderImages.find(p => p.id === 'nava-banner')!;
const babyTestImage = PlaceHolderImages.find(p => p.id === 'babytest-banner')!;

export default function LojaPage() {
    const { toast } = useToast();

    const handleAction = () => {
        toast({
            title: 'Funcionalidade em desenvolvimento',
            description: 'Estamos trabalhando para trazer essa novidade para você em breve!',
        });
    }

  return (
    <div className="space-y-12">
        {/* Brechó Section - Promoted to top */}
        <div>
            <h1 className="font-headline text-3xl font-bold">Brechó da Comunidade</h1>
            <p className="text-muted-foreground mt-1">Compre e venda itens com outras mães da nossa rede de apoio.</p>

            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Procurar por item..." className="pl-8" />
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <Select defaultValue="all">
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Categorias" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todas as categorias</SelectItem>
                            <SelectItem value="strollers">Carrinhos</SelectItem>
                            <SelectItem value="furniture">Móveis</SelectItem>
                            <SelectItem value="toys">Brinquedos</SelectItem>
                            <SelectItem value="clothing">Roupas</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button className="w-full sm:w-auto" onClick={handleAction}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Vender um item
                    </Button>
                </div>
            </div>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map(p => <ProductCard key={p.title} item={p} onBuyClick={handleAction} />)}
            </div>
        </div>

        {/* Partner Offers - Less prominent */}
        <div className="pt-8 border-t">
            <h2 className="font-headline text-2xl font-bold mb-6">Ofertas de Parceiros</h2>
            
            {/* Babytest Section - Compact */}
            <Card className="mb-6 overflow-hidden border-2">
                <div className="grid md:grid-cols-2 items-center">
                    <div className="p-6 md:p-8">
                        <CardHeader className="p-0">
                            <div className="flex items-center gap-3">
                                 <TestTube2 className="h-6 w-6 text-primary"/>
                                <CardTitle className="font-headline text-2xl">
                                    Babytest
                                </CardTitle>
                            </div>
                            <CardDescription className="text-muted-foreground mt-2">
                                Teste genético para entender predisposições do seu bebê.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-0 mt-4">
                            <Button variant="default" onClick={handleAction}>
                               Saiba mais
                            </Button>
                        </CardContent>
                    </div>
                     <div className="relative h-48 md:h-full min-h-[200px]">
                         {babyTestImage && <Image
                            src={babyTestImage.imageUrl}
                            alt={babyTestImage.description}
                            data-ai-hint={babyTestImage.imageHint}
                            fill
                            className="object-cover"
                         />}
                    </div>
                </div>
            </Card>

            {/* Nava Beachwear - Compact */}
            <Card className="overflow-hidden">
                <div className="grid md:grid-cols-2 items-center">
                    <div className="relative h-48 md:h-full min-h-[200px] order-2 md:order-1">
                        {navaImage && (
                            <Image
                                src={navaImage.imageUrl}
                                alt={navaImage.description}
                                data-ai-hint={navaImage.imageHint}
                                fill
                                className="object-cover"
                            />
                        )}
                    </div>
                    <div className="p-6 md:p-8 order-1 md:order-2">
                        <CardHeader className="p-0">
                            <div className="flex items-center gap-3">
                                 <PersonStanding className="h-6 w-6 text-primary"/>
                                <CardTitle className="font-headline text-2xl">
                                    NAVA Looks
                                </CardTitle>
                            </div>
                            <CardDescription className="text-muted-foreground mt-2">
                                Moda praia e fitness para gestantes e mamães.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-0 mt-4">
                            <Button variant="default" onClick={handleAction}>
                                Explorar coleção
                            </Button>
                        </CardContent>
                    </div>
                </div>
            </Card>
        </div>
    </div>
  );
}
