'use client';

import { PlusCircle, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ProductCard } from '@/components/product-card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useToast } from '@/hooks/use-toast';

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
    title: "Brinquedos educativos",
    price: 120.00,
    image: PlaceHolderImages.find(p => p.id === 'product-4')!,
    seller: { name: "Beatriz M.", avatar: PlaceHolderImages.find(p => p.id === 'avatar-5')! }
  },
  {
    title: "Cadeirão de alimentação Chicco",
    price: 300.00,
    image: PlaceHolderImages.find(p => p.id === 'product-5')!,
    seller: { name: "Carla D.", avatar: PlaceHolderImages.find(p => p.id === 'avatar-1')! }
  }
];

export default function MarketplacePage() {
    const { toast } = useToast();

    const handleAction = () => {
        toast({
            title: 'Funcionalidade em desenvolvimento',
            description: 'Estamos trabalhando para trazer essa novidade para você em breve!',
        });
    }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map(p => <ProductCard key={p.title} item={p} onBuyClick={handleAction} />)}
        {products.map(p => <ProductCard key={p.title + '2'} item={{...p, price: p.price/2}} onBuyClick={handleAction}/>)}
        {products.slice(0,2).map(p => <ProductCard key={p.title + '3'} item={{...p, price: p.price * 1.5}} onBuyClick={handleAction} />)}
      </div>
    </div>
  );
}
