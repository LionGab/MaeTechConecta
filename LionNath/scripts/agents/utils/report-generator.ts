/**
 * Report Generator - Gera relatórios diários
 */

import { logger } from './logger';
import * as fs from 'fs/promises';
import * as path from 'path';

export class ReportGenerator {
  private reportsDir: string = '.agents/reports';

  /**
   * Gera relatório diário
   */
  async generateDailyReport(): Promise<void> {
    const today = new Date().toISOString().split('T')[0];
    const reportFile = path.join(this.reportsDir, `${today}.md`);

    // Lê logs do dia
    const logLines = await logger.readLogs(today);

    // Analisa logs
    const stats = this.analyzeLogs(logLines);

    // Gera markdown
    const report = this.formatReport(today, stats, logLines);

    // Salva relatório
    await fs.mkdir(this.reportsDir, { recursive: true });
    await fs.writeFile(reportFile, report, 'utf8');

    await logger.info('report-generator', `Generated daily report: ${reportFile}`);
  }

  /**
   * Analisa logs e extrai estatísticas
   */
  private analyzeLogs(logLines: string[]): any {
    const stats = {
      total: logLines.length,
      byAgent: {} as Record<string, { info: number; success: number; warn: number; error: number }>,
      byLevel: { INFO: 0, SUCCESS: 0, WARN: 0, ERROR: 0 },
      commits: 0,
      filesModified: 0,
    };

    for (const line of logLines) {
      // Parse log line: [TIMESTAMP] [AGENT] [LEVEL] MESSAGE
      const match = line.match(/\[.*?\]\s+\[(.*?)\]\s+\[(.*?)\]\s+(.*)/);
      if (match) {
        const [, agent, level, message] = match;

        // Conta por agente
        if (!stats.byAgent[agent]) {
          stats.byAgent[agent] = { info: 0, success: 0, warn: 0, error: 0 };
        }
        stats.byAgent[agent][level.toLowerCase() as keyof (typeof stats.byAgent)[string]]++;

        // Conta por nível
        if (level in stats.byLevel) {
          stats.byLevel[level as keyof typeof stats.byLevel]++;
        }

        // Detecta commits
        if (message.includes('Committed changes') || message.includes('commit')) {
          stats.commits++;
        }

        // Detecta arquivos modificados
        if (message.includes('modified') || message.includes('Processed')) {
          const fileMatch = message.match(/(\d+)\s+files?/);
          if (fileMatch) {
            stats.filesModified += parseInt(fileMatch[1]);
          }
        }
      }
    }

    return stats;
  }

  /**
   * Formata relatório em markdown
   */
  private formatReport(date: string, stats: any, logLines: string[]): string {
    let report = `# Daily Report - ${date}\n\n`;
    report += `Generated at: ${new Date().toISOString()}\n\n`;

    report += `## Summary\n\n`;
    report += `- Total Log Entries: ${stats.total}\n`;
    report += `- Commits Created: ${stats.commits}\n`;
    report += `- Files Modified: ${stats.filesModified}\n\n`;

    report += `## Log Levels\n\n`;
    report += `- INFO: ${stats.byLevel.INFO}\n`;
    report += `- SUCCESS: ${stats.byLevel.SUCCESS}\n`;
    report += `- WARN: ${stats.byLevel.WARN}\n`;
    report += `- ERROR: ${stats.byLevel.ERROR}\n\n`;

    report += `## By Agent\n\n`;
    for (const [agent, agentStats] of Object.entries(stats.byAgent)) {
      const s = agentStats as any;
      report += `### ${agent}\n\n`;
      report += `- INFO: ${s.info}\n`;
      report += `- SUCCESS: ${s.success}\n`;
      report += `- WARN: ${s.warn}\n`;
      report += `- ERROR: ${s.error}\n\n`;
    }

    report += `## Recent Logs\n\n`;
    report += `\`\`\`\n`;
    report += logLines.slice(-100).join('\n');
    report += `\n\`\`\`\n`;

    return report;
  }
}

export const reportGenerator = new ReportGenerator();
