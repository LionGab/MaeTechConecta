
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function MatchesPage() {
  return (
    <div>
      <h1 className="font-headline text-3xl font-bold">Conexões</h1>
      <p className="text-muted-foreground mt-1">
        Encontre outras mães com interesses e fases parecidas com a sua.
      </p>

       <Card className="mt-8">
        <CardHeader>
          <CardTitle>Em breve</CardTitle>
        </CardHeader>
        <CardContent>
          <p>A busca por conexões está sendo preparada com muito carinho para você. Volte em breve!</p>
        </CardContent>
      </Card>
    </div>
  );
}
