
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import type { ImagePlaceholder } from '@/lib/placeholder-images';

interface InspiraCardProps {
  item: {
    title: string;
    description: string;
    image: ImagePlaceholder;
    category: string;
  };
}

export function InspiraCard({ item }: InspiraCardProps) {
  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-lg flex flex-col">
      <div className="relative aspect-video">
        <Image
          src={item.image.imageUrl}
          alt={item.image.description}
          data-ai-hint={item.image.imageHint}
          fill
          className="object-cover"
        />
      </div>
      <CardContent className="p-6 flex-grow">
        <div className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">
          {item.category}
        </div>
        <h3 className="font-headline text-2xl font-semibold leading-tight">{item.title}</h3>
        <p className="mt-3 text-base text-muted-foreground">{item.description}</p>
      </CardContent>
      <div className="p-6 pt-0">
        <Button variant="link" className="p-0 h-auto text-primary" asChild>
          <Link href="#">
            Ler reflexão <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </Card>
  );
}
