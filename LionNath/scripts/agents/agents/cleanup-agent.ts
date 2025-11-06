/**
 * Cleanup Agent - Limpeza geral
 */

import { BaseAgent } from '../base-agent';
import { glob as globSync } from 'glob';

export class CleanupAgent extends BaseAgent {
  constructor(maxFiles: number = 20, blacklist: string[] = []) {
    super('cleanup-agent', 'cleanup', maxFiles, blacklist);
  }

  protected async discoverFiles(): Promise<string[]> {
    const patterns = ['src/**/*.ts', 'src/**/*.tsx', 'apps/**/*.ts', 'apps/**/*.tsx'];

    const files: string[] = [];
    for (const pattern of patterns) {
      const matches = await globSync(pattern, { ignore: ['node_modules/**', 'dist/**', 'build/**'] });
      files.push(...matches);
    }

    return files;
  }

  protected async processFile(filePath: string): Promise<{ modified: boolean; description: string }> {
    const content = await this.readFile(filePath);
    let modified = false;
    let newContent = content;
    const improvements: string[] = [];

    // Remove imports não utilizados (detecta imports que não aparecem no código)
    const importRegex = /^import\s+.*?from\s+['"](.+?)['"];?$/gm;
    const imports: string[] = [];
    let match;
    while ((match = importRegex.exec(content)) !== null) {
      imports.push(match[0]);
    }

    // Remove console.logs de debug
    if (newContent.includes('console.log') && !newContent.includes('// Keep console.log')) {
      const consoleLogRegex = /^\s*console\.log\([^)]*\);?\s*$/gm;
      if (consoleLogRegex.test(newContent)) {
        newContent = newContent.replace(consoleLogRegex, '');
        modified = true;
        improvements.push('removed console.logs');
      }
    }

    // Remove código comentado antigo (linhas com apenas comentários)
    const commentedCodeRegex = /^\s*\/\/\s*[a-zA-Z].*$/gm;
    const commentedLines = newContent.match(commentedCodeRegex);
    if (commentedLines && commentedLines.length > 5) {
      // Remove comentários excessivos (mais de 5 linhas seguidas)
      newContent = newContent.replace(/(\/\/.*\n){6,}/g, '');
      modified = true;
      improvements.push('removed excessive commented code');
    }

    // Remove espaços em branco no final das linhas
    if (newContent.match(/[ \t]+$/m)) {
      newContent = newContent.replace(/[ \t]+$/gm, '');
      modified = true;
      improvements.push('removed trailing whitespace');
    }

    // Remove linhas vazias excessivas no final do arquivo
    newContent = newContent.replace(/\n{3,}$/, '\n\n');
    if (newContent !== content) {
      modified = true;
      improvements.push('cleaned trailing newlines');
    }

    if (modified) {
      await this.writeFile(filePath, newContent);
      return {
        modified: true,
        description: `cleanup: ${improvements.join(', ')}`,
      };
    }

    return { modified: false, description: '' };
  }
}
