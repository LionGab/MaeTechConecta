
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function JornadaPage() {
  return (
    <div>
      <h1 className="font-headline text-3xl font-bold">Sua Jornada</h1>
      <p className="text-muted-foreground mt-1">
        Artigos, vídeos e guias para te acompanhar.
      </p>

       <Card className="mt-8">
        <CardHeader>
          <CardTitle>Em breve</CardTitle>
        </CardHeader>
        <CardContent>
          <p>O conteúdo da sua jornada está sendo preparado com muito carinho. Volte em breve!</p>
        </CardContent>
      </Card>
    </div>
  );
}
