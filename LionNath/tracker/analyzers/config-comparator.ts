import { FileScanner, FileInfo } from '../utils/file-scanner';

export interface ConfigComparison {
  project: string;
  configs: {
    name: string;
    path: string;
    content: any;
    optimizations: string[];
    reactNativeCompatible: boolean;
    migrationNotes?: string;
  }[];
}

/**
 * Comparador de configurações
 */
export class ConfigComparator {
  private fileScanner: FileScanner;

  constructor(basePath: string) {
    this.fileScanner = new FileScanner(basePath);
  }

  /**
   * Compara configurações de um projeto
   */
  async compareConfigs(projectName: string, projectPath: string): Promise<ConfigComparison> {
    const scanner = new FileScanner(projectPath);
    const files = await scanner.scanDirectory();

    const configs = [];

    // Vite config
    const viteConfig = files.find((f) => f.name === 'vite.config.ts' || f.name === 'vite.config.js');
    if (viteConfig) {
      try {
        const content = await scanner.readFile(viteConfig.path);
        configs.push({
          name: 'vite.config',
          path: viteConfig.path,
          content: this.parseConfigContent(content),
          optimizations: this.extractViteOptimizations(content),
          reactNativeCompatible: false,
          migrationNotes: 'Não necessário no React Native (usa Metro bundler)',
        });
      } catch (error) {
        console.warn('Erro ao ler vite.config:', error);
      }
    }

    // Next.js config
    const nextConfig = files.find((f) => f.name === 'next.config.mjs' || f.name === 'next.config.js');
    if (nextConfig) {
      try {
        const content = await scanner.readFile(nextConfig.path);
        configs.push({
          name: 'next.config',
          path: nextConfig.path,
          content: this.parseConfigContent(content),
          optimizations: this.extractNextOptimizations(content),
          reactNativeCompatible: false,
          migrationNotes: 'Não necessário no React Native (usa Expo Router)',
        });
      } catch (error) {
        console.warn('Erro ao ler next.config:', error);
      }
    }

    // TypeScript config
    const tsConfig = files.find((f) => f.name === 'tsconfig.json');
    if (tsConfig) {
      try {
        const content = await scanner.readFile(tsConfig.path);
        const parsed = JSON.parse(content);
        configs.push({
          name: 'tsconfig.json',
          path: tsConfig.path,
          content: parsed,
          optimizations: this.extractTSOptimizations(parsed),
          reactNativeCompatible: true,
          migrationNotes: 'Compatível, mas pode precisar ajustes para React Native',
        });
      } catch (error) {
        console.warn('Erro ao ler tsconfig.json:', error);
      }
    }

    // Tailwind config
    const tailwindConfig = files.find((f) => f.name === 'tailwind.config.js' || f.name === 'tailwind.config.ts');
    if (tailwindConfig) {
      try {
        const content = await scanner.readFile(tailwindConfig.path);
        configs.push({
          name: 'tailwind.config',
          path: tailwindConfig.path,
          content: this.parseConfigContent(content),
          optimizations: this.extractTailwindOptimizations(content),
          reactNativeCompatible: false,
          migrationNotes: 'Adaptar para NativeWind no React Native',
        });
      } catch (error) {
        console.warn('Erro ao ler tailwind.config:', error);
      }
    }

    return {
      project: projectName,
      configs,
    };
  }

  /**
   * Extrai otimizações do Vite
   */
  private extractViteOptimizations(content: string): string[] {
    const optimizations: string[] = [];

    if (content.includes('vite-plugin-compression')) {
      optimizations.push('Compressão Gzip/Brotli');
    }
    if (content.includes('vite-plugin-pwa')) {
      optimizations.push('PWA completo');
    }
    if (content.includes('manualChunks')) {
      optimizations.push('Code splitting manual');
    }
    if (content.includes('terser')) {
      optimizations.push('Minificação com Terser');
    }
    if (content.includes('cssCodeSplit')) {
      optimizations.push('CSS code splitting');
    }

    return optimizations;
  }

  /**
   * Extrai otimizações do Next.js
   */
  private extractNextOptimizations(content: string): string[] {
    const optimizations: string[] = [];

    if (content.includes('optimizePackageImports')) {
      optimizations.push('Otimização de imports');
    }
    if (content.includes('image')) {
      optimizations.push('Otimização de imagens');
    }
    if (content.includes('compress')) {
      optimizations.push('Compressão habilitada');
    }

    return optimizations;
  }

  /**
   * Extrai otimizações do TypeScript
   */
  private extractTSOptimizations(config: any): string[] {
    const optimizations: string[] = [];

    if (config.compilerOptions?.strict) {
      optimizations.push('Strict mode habilitado');
    }
    if (config.compilerOptions?.skipLibCheck) {
      optimizations.push('Skip lib check (build mais rápido)');
    }

    return optimizations;
  }

  /**
   * Extrai otimizações do Tailwind
   */
  private extractTailwindOptimizations(content: string): string[] {
    const optimizations: string[] = [];

    if (content.includes('purge') || content.includes('content')) {
      optimizations.push('Purge CSS (remove CSS não usado)');
    }

    return optimizations;
  }

  /**
   * Parseia conteúdo de config (tenta JSON, senão retorna string)
   */
  private parseConfigContent(content: string): any {
    try {
      return JSON.parse(content);
    } catch {
      // Se não for JSON, retorna como string
      return content;
    }
  }
}
