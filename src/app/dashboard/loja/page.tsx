
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function LojaPage() {
  return (
    <div>
      <h1 className="font-headline text-3xl font-bold">Loja</h1>
      <p className="text-muted-foreground mt-1">
        Produtos selecionados com carinho para você e seu bebê.
      </p>

       <Card className="mt-8">
        <CardHeader>
          <CardTitle>Em breve</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Nossa lojinha está sendo preparada com muito carinho para você. Volte em breve!</p>
        </CardContent>
      </Card>
    </div>
  );
}
