import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function SignUpPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md p-8 space-y-8">
        <div className="text-center">
          <Icons.logo className="h-12 w-12 mx-auto text-primary" />
          <h1 className="font-headline text-3xl font-bold mt-4">Crie sua conta</h1>
          <p className="text-muted-foreground mt-2">Junte-se à nossa comunidade de mães.</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Cadastro</CardTitle>
            <CardDescription>Preencha os campos para criar sua conta.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input id="name" type="text" placeholder="Como podemos te chamar?" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="seu@email.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" type="password" required />
            </div>
            <Button type="submit" className="w-full">Criar conta</Button>
             <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Ou cadastre-se com
                </span>
              </div>
            </div>
            <Button variant="outline" className="w-full">
              Cadastrar com Google
            </Button>
          </CardContent>
        </Card>
        <p className="text-center text-sm text-muted-foreground">
          Já tem uma conta?{" "}
          <Link href="/" className="underline text-primary">
            Faça login
          </Link>
        </p>
      </div>
    </div>
  );
}
