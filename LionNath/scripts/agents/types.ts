/**
 * Types - Tipos compartilhados para agentes
 */

export interface AgentConfig {
  enabled: boolean;
  branch: string;
  schedule: {
    start: string;
    end: string;
    interval: number;
  };
  agents: {
    [key: string]: {
      enabled: boolean;
      maxFiles: number;
      priority: number;
    };
  };
  validation: {
    lint: boolean;
    typeCheck: boolean;
    tests: boolean;
    format: boolean;
  };
  git: {
    autoCommit: boolean;
    commitMessage: string;
    maxCommitsPerRun: number;
  };
  blacklist: string[];
}

export interface AgentResult {
  success: boolean;
  filesModified: string[];
  commitsCreated: number;
  errors: string[];
  message: string;
}

export interface Agent {
  name: string;
  type: string;
  run(): Promise<AgentResult>;
  stop(): Promise<void>;
  isRunning(): boolean;
}
