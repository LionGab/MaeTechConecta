/**
 * Refactor Agent - Refatoração de código
 */

import { BaseAgent } from '../base-agent';
import { glob as globSync } from 'glob';
import * as path from 'path';

export class RefactorAgent extends BaseAgent {
  constructor(maxFiles: number = 10, blacklist: string[] = []) {
    super('refactor-agent', 'refactor', maxFiles, blacklist);
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

    // Remove código duplicado (simplificado - remove linhas vazias excessivas)
    if (newContent.match(/\n{4,}/)) {
      newContent = newContent.replace(/\n{4,}/g, '\n\n\n');
      modified = true;
      improvements.push('removed excessive blank lines');
    }

    // Remove console.logs de debug (comentados)
    if (newContent.includes('// console.log') || newContent.includes('//console.log')) {
      newContent = newContent.replace(/\/\/\s*console\.log\([^)]*\);/g, '');
      modified = true;
      improvements.push('removed commented console.logs');
    }

    // Melhora organização de imports (remove imports duplicados)
    const importLines = newContent.split('\n').filter((line) => line.trim().startsWith('import'));
    const uniqueImports = Array.from(new Set(importLines));
    if (importLines.length !== uniqueImports.length) {
      // Reorganiza imports (simplificado)
      const nonImportLines = newContent.split('\n').filter((line) => !line.trim().startsWith('import'));
      newContent = [...uniqueImports, '', ...nonImportLines].join('\n');
      modified = true;
      improvements.push('removed duplicate imports');
    }

    if (modified) {
      await this.writeFile(filePath, newContent);
      return {
        modified: true,
        description: `refactored: ${improvements.join(', ')}`,
      };
    }

    return { modified: false, description: '' };
  }
}
