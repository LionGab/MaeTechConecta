
import { ForumClient } from './_components/forum-client';
import { Chatbot } from './_components/chatbot';

export default function ForumPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold">Comunidade</h1>
        <p className="text-muted-foreground mt-1">
          Compartilhe suas dúvidas, vitórias e encontre apoio.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2">
            <ForumClient />
        </div>
        <div className="lg:col-span-1 lg:sticky top-6">
            <Chatbot />
        </div>
      </div>
    </div>
  );
}
