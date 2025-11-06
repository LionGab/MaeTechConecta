import * as path from 'path';

/**
 * Resolvedor de caminhos para projetos
 */
export class PathResolver {
  private basePath: string;

  constructor(basePath: string) {
    this.basePath = basePath;
  }

  /**
   * Resolve caminho absoluto
   */
  resolve(...segments: string[]): string {
    return path.resolve(this.basePath, ...segments);
  }

  /**
   * Resolve caminho relativo
   */
  relative(targetPath: string): string {
    return path.relative(this.basePath, targetPath);
  }

  /**
   * Normaliza caminho
   */
  normalize(filePath: string): string {
    return path.normalize(filePath);
  }

  /**
   * Verifica se caminho existe
   */
  async exists(filePath: string): Promise<boolean> {
    try {
      const fs = await import('fs/promises');
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Obtém diretório base
   */
  getBasePath(): string {
    return this.basePath;
  }
}
