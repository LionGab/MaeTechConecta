#!/usr/bin/env node

/**
 * Stop Agents - Para todos os agentes
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const pidFile = path.join(__dirname, '..', '.agents', '.pids.json');

console.log('Stopping all agents...\n');

if (!fs.existsSync(pidFile)) {
  console.log('No running agents found.');
  process.exit(0);
}

try {
  const pids = JSON.parse(fs.readFileSync(pidFile, 'utf8'));
  
  pids.forEach(({ Type, PID }) => {
    try {
      // Tenta parar processo (Windows)
      if (process.platform === 'win32') {
        execSync(`taskkill /F /PID ${PID}`, { stdio: 'ignore' });
      } else {
        process.kill(PID, 'SIGTERM');
      }
      console.log(`Stopped ${Type}-agent (PID ${PID})`);
    } catch (error) {
      console.log(`Could not stop ${Type}-agent (PID ${PID}): Process may not exist`);
    }
  });
  
  // Remove arquivo de PIDs
  fs.unlinkSync(pidFile);
  console.log('\nAll agents stopped.');
  
} catch (error) {
  console.error('Error stopping agents:', error.message);
  process.exit(1);
}
