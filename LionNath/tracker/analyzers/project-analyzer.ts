import { FileScanner, FileInfo } from '../utils/file-scanner';
import { PathResolver } from '../utils/path-resolver';

export interface ProjectInfo {
  name: string;
  path: string;
  type: 'nextjs' | 'vite' | 'expo' | 'unknown';
  framework: string;
  version: string;
  hasTypeScript: boolean;
  hasTests: boolean;
  testFrameworks: string[];
  hasPWA: boolean;
  hasORM: boolean;
  ormType?: 'drizzle' | 'prisma' | 'other';
  database: string[];
  features: string[];
  structure: {
    hasAppDir: boolean;
    hasSrcDir: boolean;
    hasComponents: boolean;
    hasLib: boolean;
    hasHooks: boolean;
    hasServices: boolean;
  };
}

/**
 * Analisador de projetos
 */
export class ProjectAnalyzer {
  private fileScanner: FileScanner;
  private pathResolver: PathResolver;

  constructor(basePath: string) {
    this.pathResolver = new PathResolver(basePath);
    this.fileScanner = new FileScanner(basePath);
  }

  /**
   * Analisa projeto completo
   */
  async analyzeProject(projectName: string, projectPath: string): Promise<ProjectInfo> {
    const analyzer = new FileScanner(projectPath);
    const files = await analyzer.scanDirectory();

    const projectInfo: ProjectInfo = {
      name: projectName,
      path: projectPath,
      type: await this.detectProjectType(projectPath, files),
      framework: await this.detectFramework(projectPath, files),
      version: await this.detectVersion(projectPath),
      hasTypeScript: await this.hasTypeScript(projectPath, files),
      hasTests: await this.hasTests(projectPath, files),
      testFrameworks: await this.detectTestFrameworks(projectPath, files),
      hasPWA: await this.hasPWA(projectPath, files),
      hasORM: await this.hasORM(projectPath, files),
      ormType: await this.detectORMType(projectPath, files),
      database: await this.detectDatabase(projectPath, files),
      features: await this.detectFeatures(projectPath, files),
      structure: await this.analyzeStructure(projectPath, files),
    };

    return projectInfo;
  }

  private async detectProjectType(
    projectPath: string,
    files: FileInfo[]
  ): Promise<'nextjs' | 'vite' | 'expo' | 'unknown'> {
    const hasNextConfig = files.some((f) => f.name === 'next.config.mjs' || f.name === 'next.config.js');
    const hasViteConfig = files.some((f) => f.name === 'vite.config.ts' || f.name === 'vite.config.js');
    const hasExpoConfig = files.some((f) => f.name === 'app.json' || f.name === 'expo.json');

    if (hasNextConfig) return 'nextjs';
    if (hasViteConfig) return 'vite';
    if (hasExpoConfig) return 'expo';
    return 'unknown';
  }

  private async detectFramework(projectPath: string, files: FileInfo[]): Promise<string> {
    try {
      const packageJsonPath = files.find((f) => f.name === 'package.json');
      if (packageJsonPath) {
        const content = await this.fileScanner.readFile(packageJsonPath.path);
        const pkg = JSON.parse(content);
        if (pkg.dependencies?.next) return `Next.js ${pkg.dependencies.next}`;
        if (pkg.dependencies?.react && pkg.dependencies?.vite) return 'Vite + React';
        if (pkg.dependencies?.expo) return `Expo ${pkg.dependencies.expo}`;
        if (pkg.dependencies?.react) return 'React';
      }
    } catch (error) {
      console.warn('Erro ao detectar framework:', error);
    }
    return 'unknown';
  }

  private async detectVersion(projectPath: string): Promise<string> {
    try {
      const scanner = new FileScanner(projectPath);
      const files = await scanner.scanDirectory();
      const packageJson = files.find((f) => f.name === 'package.json');
      if (packageJson) {
        const content = await scanner.readFile(packageJson.path);
        const pkg = JSON.parse(content);
        return pkg.version || '0.0.0';
      }
    } catch (error) {
      console.warn('Erro ao detectar versão:', error);
    }
    return '0.0.0';
  }

  private async hasTypeScript(projectPath: string, files: FileInfo[]): Promise<boolean> {
    return (
      files.some((f) => f.name === 'tsconfig.json') || files.some((f) => f.extension === 'ts' || f.extension === 'tsx')
    );
  }

  private async hasTests(projectPath: string, files: FileInfo[]): Promise<boolean> {
    return (
      files.some((f) => f.name.includes('test') || f.name.includes('spec')) ||
      files.some((f) => f.path.includes('__tests__') || f.path.includes('tests'))
    );
  }

  private async detectTestFrameworks(projectPath: string, files: FileInfo[]): Promise<string[]> {
    const frameworks: string[] = [];
    try {
      const packageJson = files.find((f) => f.name === 'package.json');
      if (packageJson) {
        const scanner = new FileScanner(projectPath);
        const content = await scanner.readFile(packageJson.path);
        const pkg = JSON.parse(content);
        const deps = { ...pkg.dependencies, ...pkg.devDependencies };

        if (deps.vitest) frameworks.push('Vitest');
        if (deps.jest) frameworks.push('Jest');
        if (deps['@playwright/test'] || deps['playwright']) frameworks.push('Playwright');
        if (deps['@testing-library/react']) frameworks.push('Testing Library');
      }
    } catch (error) {
      console.warn('Erro ao detectar test frameworks:', error);
    }
    return frameworks;
  }

  private async hasPWA(projectPath: string, files: FileInfo[]): Promise<boolean> {
    return (
      files.some((f) => f.name === 'manifest.json' || f.name === 'manifest.webmanifest') ||
      files.some((f) => f.name === 'sw.js' || f.name === 'service-worker.js') ||
      files.some((f) => f.path.includes('vite-plugin-pwa'))
    );
  }

  private async hasORM(projectPath: string, files: FileInfo[]): Promise<boolean> {
    return (
      files.some((f) => f.name === 'drizzle.config.ts' || f.name === 'drizzle.config.js') ||
      files.some((f) => f.name === 'prisma' && f.isDirectory) ||
      files.some((f) => f.path.includes('schema.ts') && f.path.includes('db'))
    );
  }

  private async detectORMType(
    projectPath: string,
    files: FileInfo[]
  ): Promise<'drizzle' | 'prisma' | 'other' | undefined> {
    if (files.some((f) => f.name === 'drizzle.config.ts' || f.name === 'drizzle.config.js')) {
      return 'drizzle';
    }
    if (files.some((f) => f.name === 'prisma' && f.isDirectory)) {
      return 'prisma';
    }
    if (files.some((f) => f.path.includes('schema.ts') && f.path.includes('db'))) {
      return 'other';
    }
    return undefined;
  }

  private async detectDatabase(projectPath: string, files: FileInfo[]): Promise<string[]> {
    const databases: string[] = [];
    try {
      const packageJson = files.find((f) => f.name === 'package.json');
      if (packageJson) {
        const scanner = new FileScanner(projectPath);
        const content = await scanner.readFile(packageJson.path);
        const pkg = JSON.parse(content);
        const deps = { ...pkg.dependencies, ...pkg.devDependencies };

        if (deps['@supabase/supabase-js'] || deps['@supabase/ssr']) databases.push('Supabase');
        if (deps['pg'] || deps['postgres']) databases.push('PostgreSQL');
        if (deps['@netlify/neon']) databases.push('Neon (Netlify)');
      }
    } catch (error) {
      console.warn('Erro ao detectar database:', error);
    }
    return databases;
  }

  private async detectFeatures(projectPath: string, files: FileInfo[]): Promise<string[]> {
    const features: string[] = [];
    const featurePatterns: Record<string, string[]> = {
      Gamificação: ['gamification', 'points', 'badges', 'achievements'],
      'Chat IA': ['chat', 'ai', 'claude', 'gemini', 'openai'],
      'Memória Vetorial': ['vector', 'embedding', 'pgvector', 'conversations'],
      'Grupos/Comunidade': ['groups', 'community', 'forum'],
      Posts: ['posts', 'feed', 'social'],
      Receitas: ['recipes', 'receitas'],
      Onboarding: ['onboarding', 'welcome'],
      Notificações: ['notifications', 'notificacoes'],
      Perfil: ['profile', 'perfil'],
      Diário: ['journal', 'diario', 'diary'],
    };

    for (const [feature, patterns] of Object.entries(featurePatterns)) {
      const matches = patterns.some((pattern) =>
        files.some(
          (f) =>
            f.path.toLowerCase().includes(pattern.toLowerCase()) || f.name.toLowerCase().includes(pattern.toLowerCase())
        )
      );
      if (matches) {
        features.push(feature);
      }
    }

    return features;
  }

  private async analyzeStructure(projectPath: string, files: FileInfo[]): Promise<ProjectInfo['structure']> {
    return {
      hasAppDir: files.some((f) => f.path.includes('/app/') && f.isDirectory),
      hasSrcDir: files.some((f) => f.path.includes('/src/') && f.isDirectory),
      hasComponents: files.some((f) => f.path.includes('/components/') && f.isDirectory),
      hasLib: files.some((f) => f.path.includes('/lib/') && f.isDirectory),
      hasHooks: files.some((f) => f.path.includes('/hooks/') && f.isDirectory),
      hasServices: files.some((f) => f.path.includes('/services/') && f.isDirectory),
    };
  }
}
