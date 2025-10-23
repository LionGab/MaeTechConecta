'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth, initiateGoogleSignIn, initiateAppleSignIn, initiateEmailSignIn, initiateEmailSignUp, initiateInstagramSignIn } from '@/firebase';
import { Loader2, Mail, Eye, EyeOff } from 'lucide-react';
import { Icons } from '@/components/icons';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FirebaseError } from 'firebase/app';

export default function AuthPage() {
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<null | 'google' | 'apple' | 'instagram' | 'email'>(null);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('login');

  const handleAuthSuccess = (provider: string) => {
    toast({
      title: "Login bem-sucedido!",
      description: `Autenticado com ${provider}. Redirecionando...`,
    });
    router.push('/dashboard');
  }

  const handleAuthError = (error: any, provider: string) => {
    console.error(`Error with ${provider} login:`, error);
    let title = `Erro no login com ${provider}`;
    let description = "Ocorreu um erro inesperado. Tente novamente.";

    if (error instanceof FirebaseError) {
        switch (error.code) {
            case 'auth/popup-closed-by-user':
                title = 'Login cancelado';
                description = 'A janela de login foi fechada antes da conclusão.';
                break;
            case 'auth/account-exists-with-different-credential':
                title = 'Conta já existe';
                description = 'Já existe uma conta com este e-mail, mas com um método de login diferente. Tente fazer login com o outro método.';
                break;
            case 'auth/unauthorized-domain':
                title = 'Domínio não autorizado';
                description = 'Este domínio não está autorizado para operações de autenticação. Verifique a configuração no seu painel Firebase.';
                break;
            case 'auth/email-already-in-use':
                title = 'E-mail já cadastrado';
                description = 'Este e-mail já está em uso. Por favor, faça login ou use um e-mail diferente.';
                break;
            case 'auth/invalid-credential':
            case 'auth/wrong-password':
            case 'auth/user-not-found':
                 title = 'Credenciais inválidas';
                description = 'E-mail ou senha incorretos. Verifique os dados e tente novamente.';
                break;
            case 'auth/network-request-failed':
                title = 'Erro de rede';
                description = 'Não foi possível conectar ao Firebase. Verifique sua conexão com a internet.';
                break;
        }
    }
    
    toast({
        variant: "destructive",
        title: title,
        description: description,
    });
  }


  const handleSocialLogin = async (provider: 'google' | 'apple' | 'instagram') => {
    setIsLoading(provider);
    try {
      let signInFunction;
      switch (provider) {
        case 'google':
          signInFunction = initiateGoogleSignIn;
          break;
        case 'apple':
          signInFunction = initiateAppleSignIn;
          break;
        case 'instagram':
            signInFunction = initiateInstagramSignIn;
            break;
      }
      
      await signInFunction(auth);
      handleAuthSuccess(provider);

    } catch (error: any) {
        handleAuthError(error, provider);
    } finally {
        setIsLoading(null);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent, type: 'login' | 'signup') => {
    e.preventDefault();
    if (!email || !password || (type === 'signup' && !name)) return;
    setIsLoading('email');

    try {
        if (type === 'login') {
            await initiateEmailSignIn(auth, email, password);
        } else {
            const userCredential = await initiateEmailSignUp(auth, email, password);
            // Aqui você pode atualizar o perfil do usuário com o nome, se desejar
            // await updateProfile(userCredential.user, { displayName: name });
        }
        handleAuthSuccess('E-mail');
    } catch (error: any) {
        handleAuthError(error, 'E-mail');
    } finally {
        setIsLoading(null);
        setEmail('');
        setPassword('');
        setName('');
    }
  }

  const onTabChange = (value: string) => {
    setActiveTab(value);
    setEmail('');
    setPassword('');
    setName('');
    setShowPassword(false);
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <h1 className="font-headline text-4xl font-bold text-pink-500">ClubNath</h1>
          <p className="text-muted-foreground">Sua comunidade exclusiva</p>
        </div>
        
        <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-muted rounded-full">
                <TabsTrigger value="login" className="rounded-full">Entrar</TabsTrigger>
                <TabsTrigger value="signup" className="rounded-full">Criar Conta</TabsTrigger>
            </TabsList>

            <div className="space-y-4 mt-6">
                <Button variant="outline" className="w-full" onClick={() => handleSocialLogin('google')} disabled={!!isLoading}>
                    {isLoading === 'google' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Icons.google className="mr-2 h-5 w-5" />}
                    Continuar com Google
                </Button>
                <Button variant="outline" className="w-full bg-black text-white hover:bg-black/80 hover:text-white" onClick={() => handleSocialLogin('apple')} disabled={!!isLoading}>
                    {isLoading === 'apple' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Icons.apple className="mr-2 h-5 w-5 fill-white" />}
                    Continuar com Apple
                </Button>
                <Button className="w-full text-white gradient-instagram" onClick={() => handleSocialLogin('instagram')} disabled={!!isLoading}>
                    {isLoading === 'instagram' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Icons.instagram className="mr-2 h-5 w-5" />}
                    Continuar com Instagram
                </Button>
            </div>
            
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  ou
                </span>
              </div>
            </div>

            <TabsContent value="login">
                <form onSubmit={(e) => handleEmailSubmit(e, 'login')} className="space-y-4">
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input id="login-email" type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} disabled={!!isLoading} className="pl-10"/>
                    </div>
                     <div className="relative">
                        <Input id="login-password" type={showPassword ? "text" : "password"} placeholder="Senha" required value={password} onChange={(e) => setPassword(e.target.value)} disabled={!!isLoading} className="pr-10"/>
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground">
                            {showPassword ? <EyeOff /> : <Eye />}
                        </button>
                    </div>
                    <Button type="submit" className="w-full text-white gradient-primary" disabled={!!isLoading}>
                        {isLoading === 'email' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Entrar
                    </Button>
                </form>
            </TabsContent>

            <TabsContent value="signup">
                <form onSubmit={(e) => handleEmailSubmit(e, 'signup')} className="space-y-4">
                    <div className="relative">
                        <Input id="signup-name" type="text" placeholder="Nome" required value={name} onChange={(e) => setName(e.target.value)} disabled={!!isLoading} />
                    </div>
                     <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input id="signup-email" type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} disabled={!!isLoading} className="pl-10" />
                    </div>
                     <div className="relative">
                        <Input id="signup-password" type={showPassword ? "text" : "password"} placeholder="Senha" required value={password} onChange={(e) => setPassword(e.target.value)} disabled={!!isLoading} className="pr-10" />
                         <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground">
                            {showPassword ? <EyeOff /> : <Eye />}
                        </button>
                    </div>
                    <Button type="submit" className="w-full text-white gradient-primary" disabled={!!isLoading}>
                        {isLoading === 'email' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Criar Conta
                    </Button>
                </form>
            </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
