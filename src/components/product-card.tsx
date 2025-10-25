import Image from 'next/image';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import type { ImagePlaceholder } from '@/lib/placeholder-images';

interface ProductCardProps {
  item: {
    title: string;
    price: number;
    image: ImagePlaceholder;
    seller: {
      name: string;
      avatar: ImagePlaceholder;
    };
  };
  onBuyClick: () => void;
}

export function ProductCard({ item, onBuyClick }: ProductCardProps) {
  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-lg">
      <CardContent className="p-0">
        <div className="relative aspect-4/3">
          <Image
            src={item.image.imageUrl}
            alt={item.image.description}
            data-ai-hint={item.image.imageHint}
            fill
            className="object-cover"
          />
        </div>
        <div className="p-4">
          <h3 className="font-semibold truncate">{item.title}</h3>
          <p className="font-headline text-lg font-bold text-primary mt-1">
            R$ {item.price.toFixed(2).replace('.', ',')}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <Avatar className="h-6 w-6">
                <AvatarImage src={item.seller.avatar.imageUrl} alt={item.seller.name} />
                <AvatarFallback>{item.seller.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground">Vendido por {item.seller.name}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full" onClick={onBuyClick}>Comprar</Button>
      </CardFooter>
    </Card>
  );
}
