#!/usr/bin/env tsx

/**
 * Registra quaisquer ações executadas pelos agentes Cursor/automatizações.
 * Uso previsto: pnpm exec tsx scripts/register-agent-activity.ts --action "lint" --target "src" --status "success"
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import path from 'path';

const LOG_DIR = path.join(__dirname, '..', 'logs', 'agents');
const FILE_PREFIX = 'agents-';

interface AgentActivity {
  timestamp: string;
  agentId: string;
  agentName: string;
  action: string;
  target?: string;
  status?: string;
  notes?: string;
  metadata: Record<string, string | undefined>;
}

function parseArgs(): Record<string, string> {
  const args = process.argv.slice(2);
  const result: Record<string, string> = {};

  for (let i = 0; i < args.length; i += 1) {
    const current = args[i];
    const next = args[i + 1];

    if (current.startsWith('--')) {
      const key = current.replace(/^--/, '');
      if (next && !next.startsWith('--')) {
        result[key] = next;
        i += 1;
      } else {
        result[key] = 'true';
      }
    }
  }

  return result;
}

function readLog(filePath: string): AgentActivity[] {
  if (!existsSync(filePath)) {
    return [];
  }
  try {
    return JSON.parse(readFileSync(filePath, 'utf-8')) as AgentActivity[];
  } catch (error) {
    console.error(`❌ Erro ao ler log ${filePath}: ${(error as Error).message}`);
    return [];
  }
}

function writeLog(filePath: string, entries: AgentActivity[]): void {
  mkdirSync(path.dirname(filePath), { recursive: true });
  writeFileSync(filePath, JSON.stringify(entries, null, 2));
}

function main(): void {
  const args = parseArgs();

  const activity: AgentActivity = {
    timestamp: new Date().toISOString(),
    agentId: args.agent ?? process.env.CURSOR_AGENT_ID ?? 'unknown-agent',
    agentName: args.agentName ?? process.env.CURSOR_AGENT_NAME ?? 'unknown',
    action: args.action ?? 'unspecified',
    target: args.target ?? process.env.CURSOR_TARGET,
    status: args.status ?? process.env.CURSOR_ACTION_STATUS,
    notes: args.notes ?? process.env.CURSOR_ACTION_NOTES,
    metadata: {
      actor: process.env.GITHUB_ACTOR || process.env.USER,
      branch: process.env.GITHUB_REF_NAME || process.env.CI_BRANCH,
      runId: process.env.GITHUB_RUN_ID || process.env.CI_RUN_ID,
      workflow: process.env.GITHUB_WORKFLOW,
    },
  };

  const filename = `${FILE_PREFIX}${new Date().toISOString().split('T')[0]}.json`;
  const filePath = path.join(LOG_DIR, filename);
  const existing = readLog(filePath);

  existing.push(activity);
  writeLog(filePath, existing);

  console.log(`📝 Atividade registrada em ${filePath}`);
}

main();
