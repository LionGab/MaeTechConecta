
import { MatchesClient } from './_components/matches-client';

export default function MatchesPage() {
  return (
    <div>
      <h1 className="font-headline text-3xl font-bold">Conexões</h1>
      <p className="text-muted-foreground mt-1">
        Encontre outras mães com interesses e fases parecidas com a sua.
      </p>

      <div className="mt-8">
        <MatchesClient />
      </div>
    </div>
  );
}
