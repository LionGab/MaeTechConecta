/**
 * Performance Agent - Otimizações de performance
 */

import { BaseAgent } from '../base-agent';
import { glob as globSync } from 'glob';

export class PerformanceAgent extends BaseAgent {
  constructor(maxFiles: number = 8, blacklist: string[] = []) {
    super('performance-agent', 'performance', maxFiles, blacklist);
  }

  protected async discoverFiles(): Promise<string[]> {
    const patterns = ['src/components/**/*.tsx', 'src/screens/**/*.tsx', 'src/hooks/**/*.ts'];

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

    // Adiciona React.memo em componentes exportados que não têm
    if (
      filePath.endsWith('.tsx') &&
      content.includes('export') &&
      content.includes('const') &&
      !content.includes('React.memo')
    ) {
      // Verifica se é um componente funcional
      const componentMatch = content.match(/export\s+(?:const|function)\s+(\w+)\s*[:=]/);
      if (componentMatch && !content.includes('React.memo')) {
        const componentName = componentMatch[1];
        // Adiciona memo (simplificado - apenas para casos óbvios)
        if (content.includes('return') && content.includes('JSX')) {
          // Não modifica automaticamente - muito arriscado
          // Apenas detecta e sugere
        }
      }
    }

    // Otimiza FlatList com configurações adequadas
    if (content.includes('FlatList') && !content.includes('windowSize')) {
      const flatListRegex = /<FlatList([^>]*)>/g;
      if (flatListRegex.test(content)) {
        newContent = newContent.replace(/<FlatList([^>]*)>/g, (match, props) => {
          if (!props.includes('windowSize') && !props.includes('maxToRenderPerBatch')) {
            return `<FlatList${props}\n        windowSize={10}\n        maxToRenderPerBatch={10}\n        updateCellsBatchingPeriod={50}\n        removeClippedSubviews={true}\n        initialNumToRender={10}>`;
          }
          return match;
        });
        if (newContent !== content) {
          modified = true;
          improvements.push('optimized FlatList props');
        }
      }
    }

    // Adiciona useCallback em handlers se não tiver
    if (content.includes('const handle') && content.includes('=') && !content.includes('useCallback')) {
      // Detecta handlers que poderiam usar useCallback
      const handlerRegex = /const\s+(handle\w+)\s*=\s*\([^)]*\)\s*=>/g;
      const handlers = Array.from(content.matchAll(handlerRegex));
      if (handlers.length > 0 && !content.includes('useCallback')) {
        // Não modifica automaticamente - requer análise mais profunda
      }
    }

    if (modified) {
      await this.writeFile(filePath, newContent);
      return {
        modified: true,
        description: `performance: ${improvements.join(', ')}`,
      };
    }

    return { modified: false, description: '' };
  }
}
