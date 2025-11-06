import { FileScanner, FileInfo } from '../utils/file-scanner';

export interface FeatureInfo {
  name: string;
  type: 'component' | 'service' | 'hook' | 'utility' | 'api' | 'config';
  path: string;
  description?: string;
  dependencies: string[];
  isReusable: boolean;
  reactNativeCompatible: boolean;
  migrationNotes?: string;
}

export interface DetectedFeatures {
  components: FeatureInfo[];
  services: FeatureInfo[];
  hooks: FeatureInfo[];
  utilities: FeatureInfo[];
  apis: FeatureInfo[];
  configs: FeatureInfo[];
}

/**
 * Detector de features específicas
 */
export class FeatureDetector {
  private fileScanner: FileScanner;

  constructor(basePath: string) {
    this.fileScanner = new FileScanner(basePath);
  }

  /**
   * Detecta todas as features do projeto
   */
  async detectFeatures(projectPath: string): Promise<DetectedFeatures> {
    const scanner = new FileScanner(projectPath);
    const files = await scanner.scanDirectory();

    return {
      components: await this.detectComponents(projectPath, files),
      services: await this.detectServices(projectPath, files),
      hooks: await this.detectHooks(projectPath, files),
      utilities: await this.detectUtilities(projectPath, files),
      apis: await this.detectAPIs(projectPath, files),
      configs: await this.detectConfigs(projectPath, files),
    };
  }

  /**
   * Detecta componentes React
   */
  private async detectComponents(projectPath: string, files: FileInfo[]): Promise<FeatureInfo[]> {
    const components: FeatureInfo[] = [];
    const componentFiles = files.filter(
      (f) =>
        (f.extension === 'tsx' || f.extension === 'jsx') &&
        (f.path.includes('/components/') ||
          f.path.includes('/features/') ||
          f.name.endsWith('.tsx') ||
          f.name.endsWith('.jsx'))
    );

    for (const file of componentFiles) {
      try {
        const content = await this.fileScanner.readFile(file.path);
        const isReusable = this.isReusableComponent(content);
        const reactNativeCompatible = this.isReactNativeCompatible(content);

        components.push({
          name: file.name.replace(/\.(tsx|jsx)$/, ''),
          type: 'component',
          path: file.path,
          description: this.extractComponentDescription(content),
          dependencies: this.extractDependencies(content),
          isReusable,
          reactNativeCompatible,
          migrationNotes: reactNativeCompatible ? undefined : 'Requer adaptação para React Native',
        });
      } catch (error) {
        // Ignora erros de leitura
      }
    }

    return components;
  }

  /**
   * Detecta serviços
   */
  private async detectServices(projectPath: string, files: FileInfo[]): Promise<FeatureInfo[]> {
    const services: FeatureInfo[] = [];
    const serviceFiles = files.filter(
      (f) =>
        f.extension === 'ts' &&
        (f.path.includes('/services/') || f.path.includes('/lib/') || f.name.includes('.service.'))
    );

    for (const file of serviceFiles) {
      try {
        const content = await this.fileScanner.readFile(file.path);
        const isNathIA = file.path.includes('nathia') || file.path.includes('chat');
        const isGemini = content.includes('gemini') || content.includes('Gemini');

        services.push({
          name: file.name.replace(/\.(ts|js)$/, ''),
          type: 'service',
          path: file.path,
          description: this.extractServiceDescription(content),
          dependencies: this.extractDependencies(content),
          isReusable: true,
          reactNativeCompatible: true, // Serviços geralmente são compatíveis
          migrationNotes:
            isNathIA && isGemini ? 'Sistema de IA único (Gemini) - Compatível com React Native' : undefined,
        });
      } catch (error) {
        // Ignora erros de leitura
      }
    }

    return services;
  }

  /**
   * Detecta hooks customizados
   */
  private async detectHooks(projectPath: string, files: FileInfo[]): Promise<FeatureInfo[]> {
    const hooks: FeatureInfo[] = [];
    const hookFiles = files.filter(
      (f) => (f.extension === 'ts' || f.extension === 'tsx') && (f.path.includes('/hooks/') || f.name.startsWith('use'))
    );

    for (const file of hookFiles) {
      try {
        const content = await this.fileScanner.readFile(file.path);
        const reactNativeCompatible = this.isReactNativeCompatible(content);

        hooks.push({
          name: file.name.replace(/\.(ts|tsx|js|jsx)$/, ''),
          type: 'hook',
          path: file.path,
          description: this.extractHookDescription(content),
          dependencies: this.extractDependencies(content),
          isReusable: true,
          reactNativeCompatible,
          migrationNotes: reactNativeCompatible ? undefined : 'Verificar dependências web-specific',
        });
      } catch (error) {
        // Ignora erros de leitura
      }
    }

    return hooks;
  }

  /**
   * Detecta utilities
   */
  private async detectUtilities(projectPath: string, files: FileInfo[]): Promise<FeatureInfo[]> {
    const utilities: FeatureInfo[] = [];
    const utilityFiles = files.filter(
      (f) =>
        f.extension === 'ts' &&
        (f.path.includes('/utils/') || f.path.includes('/lib/utils') || f.name.includes('.util.'))
    );

    for (const file of utilityFiles) {
      try {
        const content = await this.fileScanner.readFile(file.path);
        const reactNativeCompatible = this.isReactNativeCompatible(content);

        utilities.push({
          name: file.name.replace(/\.(ts|js)$/, ''),
          type: 'utility',
          path: file.path,
          description: this.extractUtilityDescription(content),
          dependencies: this.extractDependencies(content),
          isReusable: true,
          reactNativeCompatible,
        });
      } catch (error) {
        // Ignora erros de leitura
      }
    }

    return utilities;
  }

  /**
   * Detecta APIs/rotas
   */
  private async detectAPIs(projectPath: string, files: FileInfo[]): Promise<FeatureInfo[]> {
    const apis: FeatureInfo[] = [];
    const apiFiles = files.filter(
      (f) =>
        (f.extension === 'ts' || f.extension === 'js') &&
        (f.path.includes('/api/') || f.path.includes('/routes/') || f.name === 'route.ts' || f.name === 'route.js')
    );

    for (const file of apiFiles) {
      try {
        const content = await this.fileScanner.readFile(file.path);
        const isNathIA = file.path.includes('nathia') || file.path.includes('chat');
        const isGemini = content.includes('gemini') || content.includes('Gemini');

        apis.push({
          name: this.extractAPIName(file.path),
          type: 'api',
          path: file.path,
          description: this.extractAPIDescription(content),
          dependencies: this.extractDependencies(content),
          isReusable: false, // APIs são específicas do projeto
          reactNativeCompatible: false, // APIs web não são compatíveis diretamente
          migrationNotes:
            isNathIA && isGemini
              ? 'Migrar para Supabase Edge Function - Sistema de IA único (Gemini)'
              : 'Migrar para Supabase Edge Function',
        });
      } catch (error) {
        // Ignora erros de leitura
      }
    }

    return apis;
  }

  /**
   * Detecta configurações importantes
   */
  private async detectConfigs(projectPath: string, files: FileInfo[]): Promise<FeatureInfo[]> {
    const configs: FeatureInfo[] = [];
    const configFiles = files.filter(
      (f) =>
        f.name.includes('config') ||
        f.name === 'vite.config.ts' ||
        f.name === 'next.config.mjs' ||
        f.name === 'tsconfig.json' ||
        f.name === 'tailwind.config.js'
    );

    for (const file of configFiles) {
      try {
        const content = await this.fileScanner.readFile(file.path);

        configs.push({
          name: file.name,
          type: 'config',
          path: file.path,
          description: this.extractConfigDescription(file.name, content),
          dependencies: [],
          isReusable: true,
          reactNativeCompatible: this.isConfigCompatible(file.name),
          migrationNotes: this.getConfigMigrationNotes(file.name),
        });
      } catch (error) {
        // Ignora erros de leitura
      }
    }

    return configs;
  }

  // Métodos auxiliares

  private isReusableComponent(content: string): boolean {
    return (
      content.includes('export') &&
      (content.includes('function') || content.includes('const') || content.includes('class'))
    );
  }

  private isReactNativeCompatible(content: string): boolean {
    const webOnlyPatterns = [/document\./, /window\./, /localStorage/, /sessionStorage/, /navigator\./, /HTML/, /DOM/];

    return !webOnlyPatterns.some((pattern) => pattern.test(content));
  }

  private extractComponentDescription(content: string): string {
    const commentMatch = content.match(/\/\*\*[\s\S]*?\*\//);
    if (commentMatch) {
      return commentMatch[0].replace(/\/\*\*|\*\//g, '').trim();
    }
    return '';
  }

  private extractServiceDescription(content: string): string {
    const commentMatch = content.match(/\/\*\*[\s\S]*?\*\//);
    if (commentMatch) {
      return commentMatch[0].replace(/\/\*\*|\*\//g, '').trim();
    }
    return '';
  }

  private extractHookDescription(content: string): string {
    const commentMatch = content.match(/\/\*\*[\s\S]*?\*\//);
    if (commentMatch) {
      return commentMatch[0].replace(/\/\*\*|\*\//g, '').trim();
    }
    return '';
  }

  private extractUtilityDescription(content: string): string {
    const commentMatch = content.match(/\/\*\*[\s\S]*?\*\//);
    if (commentMatch) {
      return commentMatch[0].replace(/\/\*\*|\*\//g, '').trim();
    }
    return '';
  }

  private extractAPIName(path: string): string {
    const parts = path.split('/');
    const apiIndex = parts.findIndex((p) => p === 'api');
    if (apiIndex !== -1 && apiIndex < parts.length - 1) {
      return parts.slice(apiIndex + 1).join('/');
    }
    return path;
  }

  private extractAPIDescription(content: string): string {
    const commentMatch = content.match(/\/\*\*[\s\S]*?\*\//);
    if (commentMatch) {
      return commentMatch[0].replace(/\/\*\*|\*\//g, '').trim();
    }
    return '';
  }

  private extractDependencies(content: string): string[] {
    const imports = content.match(/import\s+.*?\s+from\s+['"]([^'"]+)['"]/g);
    if (!imports) return [];

    return imports
      .map((imp) => {
        const match = imp.match(/from\s+['"]([^'"]+)['"]/);
        return match ? match[1] : '';
      })
      .filter((dep) => dep && !dep.startsWith('.') && !dep.startsWith('/'));
  }

  private extractConfigDescription(name: string, content: string): string {
    if (name.includes('vite.config')) return 'Configuração do Vite';
    if (name.includes('next.config')) return 'Configuração do Next.js';
    if (name.includes('tsconfig')) return 'Configuração do TypeScript';
    if (name.includes('tailwind')) return 'Configuração do Tailwind CSS';
    return 'Arquivo de configuração';
  }

  private isConfigCompatible(name: string): boolean {
    if (name.includes('vite.config')) return false; // Vite não é usado no React Native
    if (name.includes('next.config')) return false; // Next.js não é usado no React Native
    if (name.includes('tailwind')) return false; // Tailwind precisa de NativeWind
    return true; // tsconfig.json é compatível
  }

  private getConfigMigrationNotes(name: string): string | undefined {
    if (name.includes('vite.config')) {
      return 'Não necessário no React Native (usa Metro bundler)';
    }
    if (name.includes('next.config')) {
      return 'Não necessário no React Native (usa Expo Router)';
    }
    if (name.includes('tailwind')) {
      return 'Adaptar para NativeWind no React Native';
    }
    return undefined;
  }
}
