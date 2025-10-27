
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { CheckCircle2, Lock } from "lucide-react";
import Link from "next/link";

const journeyModules = [
  {
    title: "Módulo 1: Pós-parto e Autocuidado",
    isUnlocked: true,
    description: "Um guia para navegar os primeiros 40 dias com mais leveza, focando na sua recuperação física, mental e espiritual.",
    content: [
      { title: "Reflexão: Acolhendo o puerpério", type: "reflection", href: "#" },
      { title: "Artigo: 5 dicas de autocuidado para mães exaustas", type: "article", href: "#" },
      { title: "Vídeo: Exercícios leves para recuperação pós-parto", type: "video", href: "#" },
    ]
  },
  {
    title: "Módulo 2: Conectando com seu Bebê",
    isUnlocked: true,
    description: "Entenda os sinais do seu bebê, os saltos de desenvolvimento e como fortalecer o vínculo de vocês a cada dia.",
    content: [
      { title: "Artigo: A ciência por trás dos saltos de desenvolvimento", type: "article", href: "#" },
      { title: "Guia: Estratégias para o sono do bebê com afeto", type: "guide", href: "#" },
      { title: "Reflexão: A oração que acalma o coração na madrugada", type: "reflection", href: "#" },
    ]
  },
  {
    title: "Módulo 3: Fortalecendo a Fé e o Bem-estar",
    isUnlocked: false,
    description: "Ferramentas para nutrir sua espiritualidade, gerenciar a ansiedade e encontrar paz na rotina agitada.",
    content: [
      { title: "Estudo Bíblico: Mães da Bíblia e suas lições de fé", type: "guide", href: "#" },
      { title: "Vídeo: Meditação guiada para mães", type: "video", href: "#" },
      { title: "Artigo: Você não falhou: uma carta sobre a culpa materna", type: "article", href: "#" },
    ]
  },
    {
    title: "Módulo 4: Redescobrindo-se",
    isUnlocked: false,
    description: "Após cuidar tanto do outro, é hora de olhar para você. Dicas sobre carreira, relacionamento e sua identidade.",
    content: [
      { title: "Artigo: Mãe e empreendedora: os desafios e as delícias", type: "article", href: "#" },
      { title: "Reflexão: A força da amiga-mãe", type: "reflection", href: "#" },
      { title: "Guia: Como planejar seu retorno ao trabalho", type: "guide", href: "#" },
    ]
  },
];


export default function JourneyPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-headline text-3xl font-bold">Jornada da Maternidade</h1>
        <p className="text-muted-foreground mt-1">Um caminho de crescimento, fé e acolhimento para você.</p>
      </div>

      <Accordion type="single" collapsible className="w-full space-y-4" defaultValue="item-0">
        {journeyModules.map((module, index) => (
          <AccordionItem key={index} value={`item-${index}`} className="border bg-card rounded-xl">
            <AccordionTrigger className="p-6 text-left hover:no-underline disabled:opacity-70" disabled={!module.isUnlocked}>
                <div className="flex items-center gap-4">
                    {module.isUnlocked 
                        ? <CheckCircle2 className="h-8 w-8 text-primary shrink-0" />
                        : <Lock className="h-8 w-8 text-muted-foreground shrink-0" />
                    }
                    <div className="flex flex-col">
                        <h3 className="font-headline text-lg font-semibold">{module.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{module.description}</p>
                    </div>
                </div>
            </AccordionTrigger>
            <AccordionContent className="p-6 pt-0">
              <ul className="space-y-3">
                {module.content.map(item => (
                    <li key={item.title}>
                        <Link href={item.href} className="flex items-center text-sm text-primary hover:underline underline-offset-4">
                            - {item.title} ({item.type})
                        </Link>
                    </li>
                ))}
              </ul>
              {!module.isUnlocked && (
                <div className="mt-4 text-xs text-center text-muted-foreground bg-muted p-2 rounded-md">
                    Este módulo será liberado em breve.
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
