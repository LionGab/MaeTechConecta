'use client';
import Image from 'next/image';
import { Chatbot } from './forum/_components/chatbot';
import imageData from '@/lib/placeholder-images.json';

export default function Dashboard() {
  const welcomeImage = imageData.placeholderImages.find(p => p.id === 'avatar-1');

  return (
    <div className="flex-1 w-full max-w-2xl mx-auto">
      <div className="flex flex-col items-center text-center mb-6">
        {welcomeImage && (
          <div className="relative h-28 w-28 rounded-full overflow-hidden border-4 border-background ring-2 ring-primary mb-4">
            <Image
              src={welcomeImage.imageUrl}
              alt={welcomeImage.description}
              fill
              className="object-cover"
            />
          </div>
        )}
        <div>
          <h2 className="font-headline text-3xl font-bold tracking-tight">
            Olá, Nathália!
          </h2>
          <p className="text-muted-foreground">
            Bem-vinda de volta à sua comunidade de fé e acolhimento.
          </p>
        </div>
      </div>
      <Chatbot />
    </div>
  );
}
