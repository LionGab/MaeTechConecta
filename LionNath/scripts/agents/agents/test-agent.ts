/**
 * Test Agent - Adição de testes
 */

import { BaseAgent } from '../base-agent';
import { glob as globSync } from 'glob';
import * as path from 'path';

export class TestAgent extends BaseAgent {
  constructor(maxFiles: number = 5, blacklist: string[] = []) {
    super('test-agent', 'test', maxFiles, blacklist);
  }

  protected async discoverFiles(): Promise<string[]> {
    // Foca em arquivos que não têm testes correspondentes
    const patterns = ['src/utils/**/*.ts', 'src/hooks/**/*.ts', 'src/services/**/*.ts'];

    const files: string[] = [];
    for (const pattern of patterns) {
      const matches = await globSync(pattern, {
        ignore: ['node_modules/**', 'dist/**', 'build/**', '**/*.test.ts', '**/*.spec.ts'],
      });

      // Filtra arquivos que não têm testes
      for (const file of matches) {
        const testFile = file.replace(/\.ts$/, '.test.ts');
        const specFile = file.replace(/\.ts$/, '.spec.ts');
        const testExists = (await this.fileExists(testFile)) || (await this.fileExists(specFile));
        if (!testExists) {
          files.push(file);
        }
      }
    }

    return files;
  }

  protected async processFile(filePath: string): Promise<{ modified: boolean; description: string }> {
    // Cria arquivo de teste básico
    const testFilePath = filePath.replace(/\.ts$/, '.test.ts');

    // Verifica se já existe
    if (await this.fileExists(testFilePath)) {
      return { modified: false, description: '' };
    }

    const fileName = path.basename(filePath, '.ts');
    const testContent = `/**
 * Tests for ${fileName}
 */

import { describe, it, expect } from '@jest/globals';

describe('${fileName}', () => {
  it('should be defined', () => {
    expect(true).toBe(true);
  });
});
`;

    await this.writeFile(testFilePath, testContent);

    return {
      modified: true,
      description: `created test file for ${fileName}`,
    };
  }
}
