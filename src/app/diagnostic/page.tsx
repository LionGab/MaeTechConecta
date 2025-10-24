'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, AlertCircle, Copy, RefreshCw } from 'lucide-react';
import { firebaseConfig, isFirebaseConfigValid } from '@/firebase/config';
import { isFirebaseReady } from '@/firebase';

interface DiagnosticResult {
  name: string;
  status: 'success' | 'error' | 'warning';
  message: string;
  details?: string;
}

export default function DiagnosticPage() {
  const [diagnostics, setDiagnostics] = useState<DiagnosticResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    runDiagnostics();
  }, []);

  const runDiagnostics = async () => {
    setIsLoading(true);
    const results: DiagnosticResult[] = [];

    // 1. Verifica variáveis de ambiente
    const envVars = [
      'NEXT_PUBLIC_FIREBASE_API_KEY',
      'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
      'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
      'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
      'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
      'NEXT_PUBLIC_FIREBASE_APP_ID',
    ];

    const missingVars = envVars.filter(key => !process.env[key]);

    results.push({
      name: 'Variáveis de Ambiente',
      status: missingVars.length === 0 ? 'success' : 'error',
      message: missingVars.length === 0
        ? 'Todas as variáveis de ambiente estão configuradas'
        : `${missingVars.length} variáveis faltando`,
      details: missingVars.length > 0 ? `Faltam: ${missingVars.join(', ')}` : undefined,
    });

    // 2. Verifica configuração do Firebase
    const isConfigValid = isFirebaseConfigValid();
    results.push({
      name: 'Configuração Firebase',
      status: isConfigValid ? 'success' : 'error',
      message: isConfigValid ? 'Configuração válida' : 'Configuração inválida ou incompleta',
      details: !isConfigValid ? 'Verifique src/firebase/config.ts' : undefined,
    });

    // 3. Verifica inicialização do Firebase
    try {
      const firebaseIsReady = isFirebaseReady();
      results.push({
        name: 'Inicialização Firebase',
        status: firebaseIsReady ? 'success' : 'error',
        message: firebaseIsReady ? 'Firebase inicializado com sucesso' : 'Falha ao inicializar Firebase',
      });
    } catch (error) {
      results.push({
        name: 'Inicialização Firebase',
        status: 'error',
        message: 'Erro ao verificar Firebase',
        details: error instanceof Error ? error.message : String(error),
      });
    }

    // 4. Verifica conexão de rede
    try {
      const response = await fetch('https://www.google.com', { mode: 'no-cors' });
      results.push({
        name: 'Conexão de Rede',
        status: 'success',
        message: 'Conectado à internet',
      });
    } catch (error) {
      results.push({
        name: 'Conexão de Rede',
        status: 'error',
        message: 'Sem conexão com a internet',
      });
    }

    // 5. Verifica ambiente
    results.push({
      name: 'Ambiente',
      status: 'success',
      message: `Executando em: ${process.env.NODE_ENV || 'development'}`,
      details: `URL: ${typeof window !== 'undefined' ? window.location.origin : 'server'}`,
    });

    // 6. Verifica Firebase Auth Domain
    const currentDomain = typeof window !== 'undefined' ? window.location.hostname : 'unknown';
    const authDomain = firebaseConfig.authDomain;

    if (typeof window !== 'undefined') {
      results.push({
        name: 'Domínio Autorizado',
        status: 'warning',
        message: `Domínio atual: ${currentDomain}`,
        details: `Certifique-se de que ${currentDomain} está autorizado no Firebase Console`,
      });
    }

    setDiagnostics(results);
    setIsLoading(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getStatusIcon = (status: DiagnosticResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    }
  };

  return (
    <div className="container max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Diagnóstico do Sistema</h1>
          <p className="text-muted-foreground">Verifique o status da configuração do Firebase</p>
        </div>
        <Button onClick={runDiagnostics} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Atualizar
        </Button>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Instruções</AlertTitle>
        <AlertDescription>
          Esta página ajuda a diagnosticar problemas de configuração. Se houver erros, siga as instruções abaixo para corrigi-los.
        </AlertDescription>
      </Alert>

      <div className="grid gap-4">
        {diagnostics.map((diagnostic, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getStatusIcon(diagnostic.status)}
                  <CardTitle className="text-lg">{diagnostic.name}</CardTitle>
                </div>
              </div>
              <CardDescription>{diagnostic.message}</CardDescription>
            </CardHeader>
            {diagnostic.details && (
              <CardContent>
                <div className="bg-muted p-3 rounded-md">
                  <code className="text-sm">{diagnostic.details}</code>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configuração Atual do Firebase</CardTitle>
          <CardDescription>Valores redacted por segurança (apenas primeiros caracteres)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between bg-muted p-2 rounded">
              <span className="text-sm font-mono">API Key:</span>
              <div className="flex items-center gap-2">
                <code className="text-sm">{firebaseConfig.apiKey.substring(0, 10)}...</code>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard(firebaseConfig.apiKey)}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between bg-muted p-2 rounded">
              <span className="text-sm font-mono">Auth Domain:</span>
              <code className="text-sm">{firebaseConfig.authDomain}</code>
            </div>
            <div className="flex items-center justify-between bg-muted p-2 rounded">
              <span className="text-sm font-mono">Project ID:</span>
              <code className="text-sm">{firebaseConfig.projectId}</code>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Como Corrigir Erros</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">1. Variáveis de Ambiente Faltando</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Configure as variáveis no Netlify:
            </p>
            <ol className="list-decimal list-inside text-sm space-y-1 text-muted-foreground">
              <li>Acesse o painel do Netlify</li>
              <li>Vá em Site configuration → Environment variables</li>
              <li>Adicione todas as variáveis NEXT_PUBLIC_FIREBASE_*</li>
              <li>Faça um novo deploy</li>
            </ol>
          </div>

          <div>
            <h3 className="font-semibold mb-2">2. Domínio Não Autorizado</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Adicione o domínio do Netlify no Firebase:
            </p>
            <ol className="list-decimal list-inside text-sm space-y-1 text-muted-foreground">
              <li>Acesse o Firebase Console</li>
              <li>Vá em Authentication → Settings → Authorized domains</li>
              <li>Adicione seu domínio do Netlify (ex: app-name.netlify.app)</li>
            </ol>
          </div>

          <div>
            <h3 className="font-semibold mb-2">3. Métodos de Login Desabilitados</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Ative os métodos de autenticação:
            </p>
            <ol className="list-decimal list-inside text-sm space-y-1 text-muted-foreground">
              <li>Acesse o Firebase Console</li>
              <li>Vá em Authentication → Sign-in method</li>
              <li>Ative: Email/Password, Google, Apple, Facebook (Instagram)</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
