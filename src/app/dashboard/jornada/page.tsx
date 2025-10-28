
import { ArticleCard } from './_components/article-card';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const articles = [
    {
        title: "Como lidar com a culpa materna: 5 dicas práticas",
        description: "Aprenda a reconhecer e a lidar com um dos sentimentos mais comuns na maternidade.",
        image: PlaceHolderImages.find(p => p.id === 'content-1')!,
        category: "Autoajuda",
        source: "Nathália Valente"
    },
    {
        title: "Sono do bebê: o guia definitivo para noites mais tranquilas",
        description: "Entenda os ciclos de sono do seu filho e crie uma rotina que funcione para toda a família.",
        image: PlaceHolderImages.find(p => p.id === 'content-2')!,
        category: "Sono",
        source: "Especialista Convidado"
    },
    {
        title: "Amamentação: mitos e verdades",
        description: "Desvende os maiores mitos sobre a amamentação e sinta-se mais segura neste processo.",
        image: PlaceHolderImages.find(p => p.id === 'content-3')!,
        category: "Amamentação",
        source: "Nossa Maternidade"
    },
     {
        title: "Introdução Alimentar Participativa (BLW)",
        description: "Descubra como aplicar o método BLW de forma segura e divertida para o seu bebê.",
        image: PlaceHolderImages.find(p => p.id === 'content-4')!,
        category: "Alimentação",
        source: "Especialista Convidado"
    }
];


export default function JornadaPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold">Sua Jornada</h1>
        <p className="text-muted-foreground mt-1">
          Artigos, vídeos e guias para te acompanhar em cada fase.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {articles.map(article => (
            <ArticleCard key={article.title} item={article} />
        ))}
      </div>
    </div>
  );
}
