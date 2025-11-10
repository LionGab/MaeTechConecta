#!/usr/bin/env tsx

import { existsSync, readFileSync } from 'fs';
import path from 'path';

interface CheckResult {
  name: string;
  ok: boolean;
  details?: string;
}

const ROOT = path.join(__dirname, '..');

const REQUIRED_WORKFLOWS = [
  '.github/workflows/ci.yml',
  '.github/workflows/post-merge-validation.yml',
  '.github/workflows/vercel-preview.yml',
];

const REQUIRED_LOG_DIRS = ['logs/approvals', 'logs/agents'];
const CURSOR_CONFIG_PATH = path.join(ROOT, '.cursor', 'cli.json');

function fileExists(relativePath: string): boolean {
  return existsSync(path.join(ROOT, relativePath));
}

function checkWorkflows(): CheckResult {
  const missing = REQUIRED_WORKFLOWS.filter((file) => !fileExists(file));

  return {
    name: 'Workflows essenciais',
    ok: missing.length === 0,
    details: missing.length > 0 ? `Arquivos ausentes: ${missing.join(', ')}` : undefined,
  };
}

function checkLogDirs(): CheckResult {
  const missing = REQUIRED_LOG_DIRS.filter((dir) => !fileExists(dir));

  return {
    name: 'Diretórios de auditoria',
    ok: missing.length === 0,
    details: missing.length > 0 ? `Crie os diretórios: ${missing.join(', ')}` : undefined,
  };
}

function checkCursorConfig(): CheckResult {
  if (!existsSync(CURSOR_CONFIG_PATH)) {
    return {
      name: '.cursor/cli.json',
      ok: false,
      details: 'Arquivo ausente. Rode `node scripts/auto-approve.js configure` após instalar o Cursor CLI.',
    };
  }

  try {
    const config = JSON.parse(readFileSync(CURSOR_CONFIG_PATH, 'utf-8')) as Record<string, unknown>;
    const autoApprove = (config as { auto_approve?: boolean }).auto_approve === false;
    const skipAwaiting = (config as { skip_awaiting_review?: boolean }).skip_awaiting_review === false;

    return {
      name: 'Configuração do Cursor',
      ok: autoApprove && skipAwaiting,
      details: autoApprove && skipAwaiting
        ? undefined
        : 'auto_approve e skip_awaiting_review devem ser false. Rode `node scripts/auto-approve.js configure`.',
    };
  } catch (error) {
    return {
      name: 'Configuração do Cursor',
      ok: false,
      details: `Falha ao ler .cursor/cli.json: ${(error as Error).message}`,
    };
  }
}

function report(results: CheckResult[]): void {
  const failed = results.filter((check) => !check.ok);

  results.forEach((check) => {
    if (check.ok) {
      console.log(`✅ ${check.name}`);
    } else {
      console.error(`❌ ${check.name}`);
      if (check.details) {
        console.error(`   ${check.details}`);
      }
    }
  });

  if (failed.length > 0) {
    throw new Error(`Validação DevOps falhou (${failed.length} checagem(ns) reprovada(s)).`);
  }
}

function main(): void {
  const results = [checkWorkflows(), checkLogDirs(), checkCursorConfig()];
  report(results);
}

main();
