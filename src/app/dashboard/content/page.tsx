
'use client';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArticleCard } from './_components/article-card';
import { useToast } from '@/hooks/use-toast';

const articles = [
  {
    title: "Saúde mental da mulher: como a sobrecarga afeta o bem-estar feminino",
    description: "Uma análise aprofundada sobre os desafios da mulher moderna e o impacto na saúde mental, com dicas de especialistas para encontrar o equilíbrio.",
    image: PlaceHolderImages.find(p => p.id === 'hero')!,
    category: "Bem-estar",
    source: "Revista Elle"
  },
  {
    title: "Empreendedorismo feminino cresce e inspira novas gerações",
    description: "Conheça histórias de mulheres que transformaram suas paixões em negócios de sucesso e estão abrindo caminho para outras.",
    image: PlaceHolderImages.find(p => p.id === 'avatar-2')!,
    category: "Carreira",
    source: "Forbes Mulher"
  },
  {
    title: "Os segredos da longevidade feminina: o que a ciência diz",
    description: "Estudos recentes revelam hábitos e fatores que contribuem para uma vida mais longa e saudável para as mulheres.",
    image: PlaceHolderImages.find(p => p.id === 'content-1')!,
    category: "Saúde",
    source: "National Geographic"
  },
];

export default function ContentPage() {
    const { toast } = useToast();

    const handleAction = () => {
        toast({
            title: 'Funcionalidade em desenvolvimento',
            description: 'Estamos trabalhando para trazer essa novidade para você em breve!',
        });
    }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-headline text-3xl font-bold">Conteúdo para Você</h1>
        <p className="text-muted-foreground mt-1">Notícias e artigos selecionados sobre o universo feminino.</p>
        <div className="mt-6 grid gap-8">
          {articles.map((item) => (
            <ArticleCard key={item.title} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
