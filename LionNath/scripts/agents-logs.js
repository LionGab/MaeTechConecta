#!/usr/bin/env node

/**
 * Agents Logs - Mostra logs dos agentes
 */

const fs = require('fs');
const path = require('path');

const logsDir = path.join(__dirname, '..', '.agents', 'logs');

console.log('Agent Logs\n');
console.log('='.repeat(60));

// Lista arquivos de log
if (!fs.existsSync(logsDir)) {
  console.log('No logs directory found.');
  process.exit(0);
}

const logFiles = fs.readdirSync(logsDir)
  .filter(file => file.endsWith('.log'))
  .sort()
  .reverse(); // Mais recente primeiro

if (logFiles.length === 0) {
  console.log('No log files found.');
  process.exit(0);
}

// Mostra logs do dia atual
const today = new Date().toISOString().split('T')[0];
const todayLog = path.join(logsDir, `${today}.log`);

if (fs.existsSync(todayLog)) {
  console.log(`\nToday's logs (${today}):\n`);
  const content = fs.readFileSync(todayLog, 'utf8');
  const lines = content.split('\n').filter(line => line.trim());
  
  // Mostra últimas 50 linhas
  const recentLines = lines.slice(-50);
  recentLines.forEach(line => {
    console.log(line);
  });
  
  if (lines.length > 50) {
    console.log(`\n... (showing last 50 of ${lines.length} lines)`);
  }
} else {
  console.log(`\nNo logs for today (${today})`);
}

// Lista outros arquivos de log
if (logFiles.length > 1) {
  console.log(`\n\nOther log files:`);
  logFiles.slice(0, 5).forEach(file => {
    const filePath = path.join(logsDir, file);
    const stats = fs.statSync(filePath);
    console.log(`  ${file} (${(stats.size / 1024).toFixed(2)} KB)`);
  });
}

console.log('\n' + '='.repeat(60));
