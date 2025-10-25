
'use client';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArticleCard } from './_components/article-card';
import { useToast } from '@/hooks/use-toast';

const articles = [
  {
    title: "A exaustão invisível: como a carga mental afeta a saúde da mãe",
    description: "Uma análise aprofundada sobre o peso do gerenciamento do lar e da família e o impacto na saúde mental feminina, com dicas de especialistas para reencontrar o equilíbrio.",
    image: PlaceHolderImages.find(p => p.id === 'hero')!,
    category: "Bem-estar",
    source: "Mente & Maternidade"
  },
  {
    title: "Mãe e empreendedora: os desafios e as delícias de ter um negócio",
    description: "Conheça histórias de mulheres que transformaram suas paixões em negócios de sucesso enquanto navegavam pela maternidade, e inspire-se para começar o seu.",
    image: PlaceHolderImages.find(p => p.id === 'avatar-2')!,
    category: "Carreira",
    source: "Elas Empreendem"
  },
  {
    title: "A ciência da longevidade feminina: o que realmente funciona?",
    description: "Estudos recentes revelam como hábitos de sono, alimentação e, principalmente, a força dos laços comunitários podem contribuir para uma vida mais longa e saudável.",
    image: PlaceHolderImages.find(p => p.id === 'content-1')!,
    category: "Saúde",
    source: "Ciência & Vida"
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
