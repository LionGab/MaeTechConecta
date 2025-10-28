
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function ForumPage() {
  return (
    <div>
      <h1 className="font-headline text-3xl font-bold">Comunidade</h1>
      <p className="text-muted-foreground mt-1">
        Compartilhe suas dúvidas, vitórias e encontre apoio.
      </p>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Em breve</CardTitle>
        </CardHeader>
        <CardContent>
          <p>A área da comunidade está sendo preparada com muito carinho para você. Volte em breve!</p>
        </CardContent>
      </Card>
    </div>
  );
}
