/**
 * Type Safety Agent - Melhorias de tipagem TypeScript
 */

import { BaseAgent } from '../base-agent';
import { glob as globSync } from 'glob';

export class TypeSafetyAgent extends BaseAgent {
  constructor(maxFiles: number = 12, blacklist: string[] = []) {
    super('type-safety-agent', 'type-safety', maxFiles, blacklist);
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

    // Detecta uso de 'any' e sugere tipos (não substitui automaticamente - muito arriscado)
    if (content.includes(': any') && !content.includes('// TODO: Replace any')) {
      // Adiciona comentário TODO para revisão manual
      newContent = newContent.replace(/:\s*any\b/g, ': any // TODO: Replace with proper type');
      if (newContent !== content) {
        modified = true;
        improvements.push('marked any types for review');
      }
    }

    // Adiciona tipos de retorno explícitos em funções sem tipo
    const functionWithoutReturnType = /^(export\s+)?(async\s+)?function\s+\w+\s*\([^)]*\)\s*\{/gm;
    if (functionWithoutReturnType.test(content) && !content.includes(': Promise<') && !content.includes(': void')) {
      // Não modifica automaticamente - requer análise de retorno
    }

    // Melhora tipos de parâmetros
    if (content.includes('(param)') || content.includes('(arg)')) {
      // Detecta parâmetros sem tipo
      const paramRegex = /\((\w+)\)\s*=>/g;
      if (paramRegex.test(content)) {
        // Adiciona tipo básico
        newContent = newContent.replace(/\((\w+)\)\s*=>/g, '($1: unknown) => // TODO: Add proper type');
        if (newContent !== content) {
          modified = true;
          improvements.push('added type annotations to parameters');
        }
      }
    }

    if (modified) {
      await this.writeFile(filePath, newContent);
      return {
        modified: true,
        description: `type-safety: ${improvements.join(', ')}`,
      };
    }

    return { modified: false, description: '' };
  }
}
