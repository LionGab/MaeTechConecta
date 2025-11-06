/**
 * Docs Agent - Melhorias de documentação
 */

import { BaseAgent } from '../base-agent';
import { glob as globSync } from 'glob';

export class DocsAgent extends BaseAgent {
  constructor(maxFiles: number = 15, blacklist: string[] = []) {
    super('docs-agent', 'docs', maxFiles, blacklist);
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

    // Adiciona JSDoc em funções exportadas sem documentação
    const functionRegex = /^(export\s+)?(async\s+)?function\s+(\w+)\s*\(/gm;
    const functions = Array.from(content.matchAll(functionRegex));

    for (const match of functions) {
      const functionName = match[3];
      const functionLine = match[0];
      const functionIndex = content.indexOf(functionLine);

      // Verifica se já tem JSDoc antes
      const beforeFunction = content.substring(Math.max(0, functionIndex - 200), functionIndex);
      if (!beforeFunction.includes('/**') && !beforeFunction.includes('* @')) {
        const jsdoc = `/**
 * ${functionName}
 * 
 * TODO: Add description
 */
`;
        newContent = newContent.replace(functionLine, jsdoc + functionLine);
        modified = true;
        improvements.push(`added JSDoc to ${functionName}`);
        break; // Apenas uma função por vez
      }
    }

    // Adiciona comentários em código complexo
    if (content.includes('useEffect') && !content.includes('// Effect:')) {
      const useEffectRegex = /useEffect\(\(\)\s*=>\s*\{/g;
      if (useEffectRegex.test(content)) {
        // Adiciona comentário explicativo
        newContent = newContent.replace(
          /useEffect\(\(\)\s*=>\s*\{/g,
          'useEffect(() => {\n    // Effect: TODO - Add description'
        );
        modified = true;
        improvements.push('added comments to useEffect');
      }
    }

    if (modified) {
      await this.writeFile(filePath, newContent);
      return {
        modified: true,
        description: `docs: ${improvements.join(', ')}`,
      };
    }

    return { modified: false, description: '' };
  }
}
