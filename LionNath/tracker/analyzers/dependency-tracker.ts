import { FileScanner } from '../utils/file-scanner';

export interface DependencyInfo {
  name: string;
  version: string;
  type: 'dependency' | 'devDependency';
  projects: string[];
  isReactNativeCompatible: boolean;
  reactNativeAlternative?: string;
  notes?: string;
}

export interface DependencyReport {
  allDependencies: DependencyInfo[];
  uniqueDependencies: DependencyInfo[];
  conflictingVersions: DependencyInfo[];
  reactNativeCompatible: DependencyInfo[];
  reactNativeIncompatible: DependencyInfo[];
}

/**
 * Rastreador de dependências
 */
export class DependencyTracker {
  private fileScanner: FileScanner;

  constructor(basePath: string) {
    this.fileScanner = new FileScanner(basePath);
  }

  /**
   * Rastreia dependências de um projeto
   */
  async trackDependencies(projectName: string, projectPath: string): Promise<DependencyInfo[]> {
    const scanner = new FileScanner(projectPath);
    const files = await scanner.scanDirectory();
    const packageJson = files.find((f) => f.name === 'package.json');

    if (!packageJson) {
      return [];
    }

    try {
      const content = await scanner.readFile(packageJson.path);
      const pkg = JSON.parse(content);

      const dependencies: DependencyInfo[] = [];

      // Dependências principais
      if (pkg.dependencies) {
        for (const [name, version] of Object.entries(pkg.dependencies)) {
          dependencies.push({
            name,
            version: version as string,
            type: 'dependency',
            projects: [projectName],
            isReactNativeCompatible: this.isReactNativeCompatible(name),
            reactNativeAlternative: this.getReactNativeAlternative(name),
            notes: this.getDependencyNotes(name),
          });
        }
      }

      // DevDependencies
      if (pkg.devDependencies) {
        for (const [name, version] of Object.entries(pkg.devDependencies)) {
          dependencies.push({
            name,
            version: version as string,
            type: 'devDependency',
            projects: [projectName],
            isReactNativeCompatible: this.isReactNativeCompatible(name),
            reactNativeAlternative: this.getReactNativeAlternative(name),
            notes: this.getDependencyNotes(name),
          });
        }
      }

      return dependencies;
    } catch (error) {
      console.warn(`Erro ao ler package.json de ${projectName}:`, error);
      return [];
    }
  }

  /**
   * Consolida dependências de múltiplos projetos
   */
  consolidateDependencies(allDependencies: DependencyInfo[]): DependencyReport {
    const dependencyMap = new Map<string, DependencyInfo>();

    // Agrupa dependências por nome
    for (const dep of allDependencies) {
      const key = dep.name;
      if (dependencyMap.has(key)) {
        const existing = dependencyMap.get(key)!;
        existing.projects.push(...dep.projects);
        // Mantém a versão mais recente ou mais comum
        if (dep.version !== existing.version) {
          existing.notes = `Versões conflitantes: ${existing.version} vs ${dep.version}`;
        }
      } else {
        dependencyMap.set(key, { ...dep });
      }
    }

    const allDeps = Array.from(dependencyMap.values());
    const uniqueDeps = allDeps.filter((dep, index, self) => index === self.findIndex((d) => d.name === dep.name));

    const conflictingVersions = allDeps.filter((dep) => dep.notes?.includes('Versões conflitantes'));

    const reactNativeCompatible = allDeps.filter((dep) => dep.isReactNativeCompatible);
    const reactNativeIncompatible = allDeps.filter((dep) => !dep.isReactNativeCompatible);

    return {
      allDependencies: allDeps,
      uniqueDependencies: uniqueDeps,
      conflictingVersions,
      reactNativeCompatible,
      reactNativeIncompatible,
    };
  }

  /**
   * Verifica se dependência é compatível com React Native
   */
  private isReactNativeCompatible(name: string): boolean {
    const incompatiblePatterns = [
      'next',
      'vite',
      'react-dom',
      'playwright',
      '@playwright',
      'vitest',
      '@vitejs',
      '@next',
      'webpack',
      'rollup',
      'esbuild',
    ];

    const compatiblePatterns = [
      'react',
      'react-native',
      'expo',
      '@expo',
      '@supabase',
      '@tanstack/react-query',
      'react-hook-form',
      'zod',
      'date-fns',
      'lucide-react-native',
      '@google/generative-ai',
    ];

    // Verifica padrões incompatíveis
    if (incompatiblePatterns.some((pattern) => name.includes(pattern))) {
      return false;
    }

    // Verifica padrões compatíveis
    if (compatiblePatterns.some((pattern) => name.includes(pattern))) {
      return true;
    }

    // Dependências web geralmente não são compatíveis
    if (name.includes('dom') || name.includes('web')) {
      return false;
    }

    // Por padrão, assume compatível (pode ser biblioteca genérica)
    return true;
  }

  /**
   * Obtém alternativa para React Native
   */
  private getReactNativeAlternative(name: string): string | undefined {
    const alternatives: Record<string, string> = {
      'lucide-react': 'lucide-react-native',
      'react-dom': 'react-native',
      next: 'expo-router',
      vite: 'expo (Metro bundler)',
      '@vitejs/plugin-react': 'expo',
      tailwindcss: 'nativewind',
      '@tailwindcss/postcss': 'nativewind',
      vitest: 'jest (com @testing-library/react-native)',
      '@playwright/test': 'detox ou appium',
    };

    return alternatives[name];
  }

  /**
   * Obtém notas sobre dependência
   */
  private getDependencyNotes(name: string): string | undefined {
    const notes: Record<string, string> = {
      '@supabase/supabase-js': 'Compatível com React Native',
      '@supabase/ssr': 'Não necessário no React Native (usa @supabase/supabase-js)',
      '@google/generative-ai': 'Sistema de IA único (Gemini) - Compatível',
      '@anthropic-ai/sdk': 'Não usar - Focar apenas em Gemini',
      '@ai-sdk/anthropic': 'Não usar - Focar apenas em Gemini',
      '@ai-sdk/openai': 'Não usar - Focar apenas em Gemini',
      openai: 'Não usar - Focar apenas em Gemini',
      'next-themes': 'Usar expo-system-ui ou react-native-appearance',
      swr: 'Usar @tanstack/react-query (melhor para React Native)',
    };

    return notes[name];
  }
}
