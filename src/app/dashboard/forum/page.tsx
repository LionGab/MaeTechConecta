
'use client';
import { ForumClient } from './_components/forum-client';
import { Chatbot } from './_components/chatbot';

export default function ForumPage() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      <div className="xl:col-span-2 space-y-6">
        <h1 className="font-headline text-2xl font-bold">Comunidade</h1>
        <ForumClient />
      </div>
      <div className="xl:col-span-1 xl:sticky top-6">
         <Chatbot />
      </div>
    </div>
  );
}
