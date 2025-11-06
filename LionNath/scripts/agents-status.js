#!/usr/bin/env node

/**
 * Agents Status - Mostra status dos agentes
 */

const fs = require('fs');
const path = require('path');

const statusFile = path.join(__dirname, '..', '.agents', 'status.json');
const pidFile = path.join(__dirname, '..', '.agents', '.pids.json');

console.log('Agent Status\n');
console.log('='.repeat(60));

// Lê status
let status = {};
if (fs.existsSync(statusFile)) {
  try {
    status = JSON.parse(fs.readFileSync(statusFile, 'utf8'));
  } catch (error) {
    console.error('Error reading status file:', error.message);
  }
}

// Lê PIDs
let pids = [];
if (fs.existsSync(pidFile)) {
  try {
    pids = JSON.parse(fs.readFileSync(pidFile, 'utf8'));
  } catch (error) {
    // Ignora erro
  }
}

console.log('\nRunning Processes:');
if (pids.length > 0) {
  pids.forEach(({ Type, PID }) => {
    console.log(`  ${Type}: PID ${PID}`);
  });
} else {
  console.log('  No running processes found');
}

console.log('\nAgent Status:');
if (status.agents && Object.keys(status.agents).length > 0) {
  for (const [type, info] of Object.entries(status.agents)) {
    console.log(`\n  ${type}:`);
    console.log(`    Last Run: ${info.lastRun || 'Never'}`);
    console.log(`    Success: ${info.success ? 'Yes' : 'No'}`);
    console.log(`    Files Modified: ${info.filesModified || 0}`);
    console.log(`    Commits Created: ${info.commitsCreated || 0}`);
    console.log(`    Errors: ${info.errors || 0}`);
  }
} else {
  console.log('  No agent status available');
}

console.log(`\nLast Update: ${status.lastUpdate || 'Never'}`);
console.log('='.repeat(60));
