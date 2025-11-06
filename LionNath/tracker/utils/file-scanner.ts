import * as fs from 'fs/promises';
import * as path from 'path';
import { PathResolver } from './path-resolver';

export interface FileInfo {
  path: string;
  name: string;
  extension: string;
  size: number;
  isDirectory: boolean;
  lastModified: Date;
}

export interface ScanOptions {
  maxDepth?: number;
  ignorePatterns?: string[];
  includePatterns?: string[];
}

/**
 * Scanner de arquivos para análise de projetos
 */
export class FileScanner {
  private pathResolver: PathResolver;
  private ignorePatterns: string[] = [
    'node_modules',
    '.git',
    '.next',
    'dist',
    'build',
    'coverage',
    '.cache',
    '.turbo',
    'playwright-report',
    'test-results',
    'logs',
  ];

  constructor(basePath: string) {
    this.pathResolver = new PathResolver(basePath);
  }

  /**
   * Escaneia diretório recursivamente
   */
  async scanDirectory(dirPath: string = '', options: ScanOptions = {}): Promise<FileInfo[]> {
    const fullPath = this.pathResolver.resolve(dirPath);
    const files: FileInfo[] = [];
    const maxDepth = options.maxDepth ?? 10;
    const ignorePatterns = [...this.ignorePatterns, ...(options.ignorePatterns || [])];

    try {
      await this.scanRecursive(fullPath, dirPath, files, 0, maxDepth, ignorePatterns, options.includePatterns);
    } catch (error) {
      console.warn(`Erro ao escanear ${fullPath}:`, error);
    }

    return files;
  }

  private async scanRecursive(
    currentPath: string,
    relativePath: string,
    files: FileInfo[],
    depth: number,
    maxDepth: number,
    ignorePatterns: string[],
    includePatterns?: string[]
  ): Promise<void> {
    if (depth > maxDepth) return;

    const shouldIgnore = ignorePatterns.some((pattern) => currentPath.includes(pattern));

    if (shouldIgnore) return;

    try {
      const entries = await fs.readdir(currentPath, { withFileTypes: true });

      for (const entry of entries) {
        const entryPath = path.join(currentPath, entry.name);
        const entryRelativePath = path.join(relativePath, entry.name);

        // Verifica padrões de inclusão
        if (includePatterns && includePatterns.length > 0) {
          const matches = includePatterns.some((pattern) => entryPath.includes(pattern) || entry.name.match(pattern));
          if (!matches) continue;
        }

        try {
          const stats = await fs.stat(entryPath);
          const fileInfo: FileInfo = {
            path: entryRelativePath,
            name: entry.name,
            extension: entry.isFile() ? path.extname(entry.name).slice(1) : '',
            size: stats.size,
            isDirectory: entry.isDirectory(),
            lastModified: stats.mtime,
          };

          files.push(fileInfo);

          if (entry.isDirectory()) {
            await this.scanRecursive(
              entryPath,
              entryRelativePath,
              files,
              depth + 1,
              maxDepth,
              ignorePatterns,
              includePatterns
            );
          }
        } catch (error) {
          // Ignora erros de permissão
        }
      }
    } catch (error) {
      // Ignora erros de leitura
    }
  }

  /**
   * Lê conteúdo de arquivo
   */
  async readFile(filePath: string): Promise<string> {
    const fullPath = this.pathResolver.resolve(filePath);
    return await fs.readFile(fullPath, 'utf-8');
  }

  /**
   * Verifica se arquivo existe
   */
  async fileExists(filePath: string): Promise<boolean> {
    return await this.pathResolver.exists(this.pathResolver.resolve(filePath));
  }

  /**
   * Obtém estatísticas de diretório
   */
  async getDirectoryStats(dirPath: string = ''): Promise<{
    totalFiles: number;
    totalDirs: number;
    totalSize: number;
    extensions: Record<string, number>;
  }> {
    const files = await this.scanDirectory(dirPath);
    const stats = {
      totalFiles: 0,
      totalDirs: 0,
      totalSize: 0,
      extensions: {} as Record<string, number>,
    };

    for (const file of files) {
      if (file.isDirectory) {
        stats.totalDirs++;
      } else {
        stats.totalFiles++;
        stats.totalSize += file.size;
        if (file.extension) {
          stats.extensions[file.extension] = (stats.extensions[file.extension] || 0) + 1;
        }
      }
    }

    return stats;
  }
}
