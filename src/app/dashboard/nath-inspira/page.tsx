
'use client';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { InspiraCard } from './_components/inspira-card';

const articles = [
  {
    title: "Encontrando força na fé durante a maternidade",
    description: "Uma reflexão profunda sobre como a espiritualidade pode ser o alicerce para os desafios e as alegrias de ser mãe, inspirada em falas de Nathália Valente.",
    image: PlaceHolderImages.find(p => p.id === 'hero')!,
    category: "Fé e Espiritualidade"
  },
  {
    title: "Autocuidado não é egoísmo: é necessidade",
    description: "Nathália nos lembra que, para cuidar bem dos nossos filhos, precisamos primeiro cuidar de nós mesmas. Descubra dicas práticas para incluir o autocuidado na sua rotina.",
    image: PlaceHolderImages.find(p => p.id === 'avatar-2')!,
    category: "Bem-estar"
  },
  {
    title: "Lidando com a culpa materna: você está fazendo o seu melhor",
    description: "Uma conversa sincera para desmistificar a culpa que muitas mães sentem, com conselhos para abraçar a imperfeição e celebrar cada passo da jornada.",
    image: PlaceHolderImages.find(p => p.id === 'content-1')!,
    category: "Maternidade Real"
  },
  {
    title: "A importância da rede de apoio: ninguém precisa estar sozinha",
    description: "Entenda por que construir e nutrir uma rede de apoio é vital no pós-parto e na criação dos filhos. Juntas somos mais fortes.",
    image: PlaceHolderImages.find(p => p.id === 'feature-matches')!,
    category: "Comunidade"
  },
  {
    title: "Sono do bebê: estratégias para noites mais tranquilas",
    description: "Estratégias e dicas valiosas para ajudar seu bebê (e você) a ter um sono de mais qualidade, estabelecendo rotinas saudáveis e com muito afeto.",
    image: PlaceHolderImages.find(p => p.id === 'content-2')!,
    category: "Criação de Filhos"
  }
];

export default function NathInspiraPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-headline text-3xl font-bold">Nath Inspira</h1>
        <p className="text-muted-foreground mt-1">Reflexões e sabedorias de Nathália Valente para a sua jornada.</p>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((item) => (
            <InspiraCard key={item.title} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
