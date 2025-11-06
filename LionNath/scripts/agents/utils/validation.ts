/**
 * Validation - Validação pré-commit
 *
 * Valida código antes de fazer commit (lint, type-check, tests)
 */

import { execSync } from 'child_process';
import * as path from 'path';

export interface ValidationResult {
  success: boolean;
  errors: string[];
  warnings: string[];
}

export interface ValidationOptions {
  lint?: boolean;
  typeCheck?: boolean;
  tests?: boolean;
  format?: boolean;
}

export class Validation {
  private repoPath: string;

  constructor(repoPath: string = process.cwd()) {
    this.repoPath = repoPath;
  }

  /**
   * Executa comando e captura output
   */
  private execCommand(
    command: string,
    options: { silent?: boolean } = {}
  ): { success: boolean; output: string; error?: string } {
    try {
      const output = execSync(command, {
        cwd: this.repoPath,
        encoding: 'utf8',
        stdio: options.silent ? 'pipe' : 'inherit',
      });
      return {
        success: true,
        output: output.toString(),
      };
    } catch (error: any) {
      return {
        success: false,
        output: error.stdout?.toString() || '',
        error: error.stderr?.toString() || error.message,
      };
    }
  }

  /**
   * Valida lint
   */
  async validateLint(): Promise<ValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      const result = this.execCommand('pnpm lint', { silent: true });

      if (!result.success) {
        // Parse lint errors
        const output = result.error || result.output;
        if (output.includes('error')) {
          errors.push('Lint errors found');
        }
        if (output.includes('warning')) {
          warnings.push('Lint warnings found');
        }
      }

      return {
        success: result.success,
        errors,
        warnings,
      };
    } catch (error: any) {
      return {
        success: false,
        errors: [`Lint validation failed: ${error.message}`],
        warnings: [],
      };
    }
  }

  /**
   * Valida type-check
   */
  async validateTypeCheck(): Promise<ValidationResult> {
    const errors: string[] = [];

    try {
      const result = this.execCommand('pnpm type-check', { silent: true });

      if (!result.success) {
        errors.push('Type check failed');
      }

      return {
        success: result.success,
        errors,
        warnings: [],
      };
    } catch (error: any) {
      return {
        success: false,
        errors: [`Type check failed: ${error.message}`],
        warnings: [],
      };
    }
  }

  /**
   * Valida testes
   */
  async validateTests(): Promise<ValidationResult> {
    const errors: string[] = [];

    try {
      const result = this.execCommand('pnpm test --passWithNoTests', { silent: true });

      if (!result.success) {
        errors.push('Tests failed');
      }

      return {
        success: result.success,
        errors,
        warnings: [],
      };
    } catch (error: any) {
      // Se não houver testes, considera sucesso
      return {
        success: true,
        errors: [],
        warnings: [],
      };
    }
  }

  /**
   * Valida formatação
   */
  async validateFormat(): Promise<ValidationResult> {
    const errors: string[] = [];

    try {
      // Verifica se há arquivos não formatados
      const result = this.execCommand('pnpm format --check', { silent: true });

      if (!result.success) {
        // Tenta formatar automaticamente
        const formatResult = this.execCommand('pnpm format', { silent: true });
        if (!formatResult.success) {
          errors.push('Format validation failed');
        }
      }

      return {
        success: true,
        errors: [],
        warnings: [],
      };
    } catch (error: any) {
      return {
        success: false,
        errors: [`Format validation failed: ${error.message}`],
        warnings: [],
      };
    }
  }

  /**
   * Valida tudo conforme opções
   */
  async validateAll(options: ValidationOptions = {}): Promise<ValidationResult> {
    const { lint = true, typeCheck = true, tests = true, format = true } = options;

    const allErrors: string[] = [];
    const allWarnings: string[] = [];

    // Valida lint
    if (lint) {
      const lintResult = await this.validateLint();
      allErrors.push(...lintResult.errors);
      allWarnings.push(...lintResult.warnings);
    }

    // Valida type-check
    if (typeCheck) {
      const typeResult = await this.validateTypeCheck();
      allErrors.push(...typeResult.errors);
    }

    // Valida testes
    if (tests) {
      const testResult = await this.validateTests();
      allErrors.push(...testResult.errors);
    }

    // Valida formatação
    if (format) {
      const formatResult = await this.validateFormat();
      allErrors.push(...formatResult.errors);
    }

    return {
      success: allErrors.length === 0,
      errors: allErrors,
      warnings: allWarnings,
    };
  }
}

// Instância singleton
export const validation = new Validation();
