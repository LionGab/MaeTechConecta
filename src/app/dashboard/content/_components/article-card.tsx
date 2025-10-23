
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import type { ImagePlaceholder } from '@/lib/placeholder-images';

interface ArticleCardProps {
  item: {
    title: string;
    description: string;
    image: ImagePlaceholder;
    category: string;
    source: string;
  };
  className?: string;
}

export function ArticleCard({ item, className }: ArticleCardProps) {
  return (
    <Card className={`overflow-hidden transition-shadow hover:shadow-lg flex flex-col md:flex-row ${className}`}>
      <div className="md:w-1/3">
        <div className="relative aspect-video md:aspect-square h-full">
          <Image
            src={item.image.imageUrl}
            alt={item.image.description}
            data-ai-hint={item.image.imageHint}
            fill
            className="object-cover"
          />
        </div>
      </div>
      <div className="md:w-2/3 flex flex-col">
        <CardContent className="p-6 flex-grow">
           <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            {item.source}
          </div>
          <h3 className="font-headline text-2xl font-semibold leading-tight">{item.title}</h3>
          <p className="mt-3 text-base text-muted-foreground">{item.description}</p>
        </CardContent>
         <div className="p-6 pt-0">
          <Button variant="link" className="p-0 h-auto text-primary" asChild>
            <Link href="#">
              Ler mais <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}
