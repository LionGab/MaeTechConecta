/**
 * Security Agent - Melhorias de segurança
 */

import { BaseAgent } from '../base-agent';
import { glob as globSync } from 'glob';

export class SecurityAgent extends BaseAgent {
  constructor(maxFiles: number = 8, blacklist: string[] = []) {
    super('security-agent', 'security', maxFiles, blacklist);
  }

  protected async discoverFiles(): Promise<string[]> {
    const patterns = ['src/services/**/*.ts', 'src/lib/**/*.ts', 'src/utils/**/*.ts'];

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

    // Detecta possíveis vazamentos de dados sensíveis
    const sensitivePatterns = [
      /password\s*[:=]\s*['"][^'"]+['"]/gi,
      /api[_-]?key\s*[:=]\s*['"][^'"]+['"]/gi,
      /secret\s*[:=]\s*['"][^'"]+['"]/gi,
    ];

    for (const pattern of sensitivePatterns) {
      if (pattern.test(content) && !content.includes('// TODO: Move to env')) {
        newContent = newContent.replace(pattern, (match) => `${match} // TODO: Move to environment variables`);
        if (newContent !== content) {
          modified = true;
          improvements.push('flagged potential secret exposure');
        }
      }
    }

    // Verifica uso de eval (perigoso)
    if (content.includes('eval(') && !content.includes('// Security: eval usage')) {
      newContent = newContent.replace(/eval\(/g, 'eval( // Security: Review eval usage - potential security risk');
      modified = true;
      improvements.push('flagged eval usage');
    }

    // Verifica uso de innerHTML (XSS risk)
    if (content.includes('innerHTML') && !content.includes('// Security:')) {
      newContent = newContent.replace(/innerHTML/g, 'innerHTML // Security: Review for XSS risks');
      modified = true;
      improvements.push('flagged innerHTML usage');
    }

    // Adiciona validação de input se não tiver
    if (content.includes('function') && (content.includes('userInput') || content.includes('input'))) {
      if (!content.includes('validate') && !content.includes('sanitize')) {
        // Adiciona comentário TODO
        const functionRegex = /(function\s+\w+\s*\([^)]*input[^)]*\)\s*\{)/;
        if (functionRegex.test(content)) {
          newContent = newContent.replace(functionRegex, '$1\n    // TODO: Add input validation/sanitization');
          if (newContent !== content) {
            modified = true;
            improvements.push('added input validation reminder');
          }
        }
      }
    }

    if (modified) {
      await this.writeFile(filePath, newContent);
      return {
        modified: true,
        description: `security: ${improvements.join(', ')}`,
      };
    }

    return { modified: false, description: '' };
  }
}
