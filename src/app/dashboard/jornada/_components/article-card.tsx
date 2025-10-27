
'use client';

import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { ImagePlaceholder } from '@/lib/placeholder-images';
import Link from 'next/link';

interface ArticleCardProps {
  item: {
    title: string;
    description: string;
    image: ImagePlaceholder;
    category: string;
    source: string;
  };
}

export function ArticleCard({ item }: ArticleCardProps) {
  return (
    <Link href="#">
        <Card className="grid grid-cols-1 md:grid-cols-3 items-center overflow-hidden transition-shadow hover:shadow-lg h-full">
        <div className="md:col-span-1 relative w-full h-48 md:h-full">
            <Image
            src={item.image.imageUrl}
            alt={item.image.description}
            data-ai-hint={item.image.imageHint}
            fill
            className="object-cover"
            />
        </div>
        <div className="md:col-span-2 p-6">
            <Badge variant="secondary">{item.source}</Badge>
            <h3 className="font-headline text-lg font-bold mt-2">{item.title}</h3>
            <p className="text-sm text-muted-foreground mt-2">{item.description}</p>
        </div>
        </Card>
    </Link>
  );
}
