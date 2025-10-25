
'use client';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { InspiraCard } from './_components/inspira-card';

const articles = [
  {
    title: "A oração que acalma o coração na madrugada",
    description: "Uma reflexão sobre como um simples momento de conversa com Deus pode transformar a ansiedade das noites insones em um abraço de paz e confiança.",
    image: PlaceHolderImages.find(p => p.id === 'hero')!,
    category: "Fé e Espiritualidade"
  },
  {
    title: "Autocuidado em 5 minutos: o ritual que salva o seu dia",
    description: "Nathália nos lembra que cuidar de si não exige horas. Descubra um ritual prático para renovar suas energias, mesmo na rotina mais corrida.",
    image: PlaceHolderImages.find(p => p.id === 'avatar-2')!,
    category: "Bem-estar"
  },
  {
    title: "Você não falhou: uma carta sobre a culpa materna",
    description: "Uma conversa sincera para acolher seu coração e te lembrar que você está fazendo o seu melhor, mesmo nos dias em que tudo parece dar errado.",
    image: PlaceHolderImages.find(p => p.id === 'content-1')!,
    category: "Maternidade Real"
  },
  {
    title: "A força da amiga-mãe: por que ninguém deve caminhar sozinha",
    description: "Entenda por que a amizade e a vulnerabilidade entre mães são a base para uma jornada mais leve e feliz. Juntas, florescemos.",
    image: PlaceHolderImages.find(p => p.id === 'feature-matches')!,
    category: "Comunidade"
  },
  {
    title: "Sono do bebê: mais do que técnica, é conexão",
    description: "Estratégias para ensinar seu bebê a dormir com afeto, entendendo que a segurança emocional é a chave para noites mais tranquilas para toda a família.",
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
