# Start Agents Windows - Inicia 8 agentes em janelas separadas
# PowerShell script para Windows

$ErrorActionPreference = "Continue"

$agents = @(
    "refactor",
    "performance",
    "test",
    "docs",
    "type-safety",
    "accessibility",
    "security",
    "cleanup"
)

$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Split-Path -Parent $scriptPath
$runAgentScript = Join-Path $scriptPath "agents" "run-agent.js"

Write-Host "Starting 8 agents in separate PowerShell windows..." -ForegroundColor Cyan
Write-Host ""

# Cria diretorio .agents se nao existir
$agentsDir = Join-Path $projectRoot ".agents"
if (-not (Test-Path $agentsDir)) {
    New-Item -ItemType Directory -Path $agentsDir -Force | Out-Null
}

$pids = @()

foreach ($agentType in $agents) {
    Write-Host "Starting $agentType-agent..." -ForegroundColor Yellow
    
    $windowTitle = "Agent: $agentType"
    
    # Abre nova janela PowerShell para cada agente
    $process = Start-Process powershell -ArgumentList @(
        "-NoExit",
        "-Command",
        "cd '$projectRoot'; Write-Host 'Agent: $agentType' -ForegroundColor Green; Write-Host ''; node '$runAgentScript' $agentType"
    ) -PassThru -WindowStyle Normal
    
    $pids += @{
        Type = $agentType
        PID = $process.Id
    }
    
    Start-Sleep -Milliseconds 500
}

# Salva PIDs
$pidFile = Join-Path $agentsDir ".pids.json"
$pids | ConvertTo-Json | Set-Content $pidFile -Encoding UTF8

Write-Host ""
Write-Host "All agents started!" -ForegroundColor Green
Write-Host "PIDs saved to: $pidFile" -ForegroundColor Gray
Write-Host ""
Write-Host "Each agent is running in its own PowerShell window." -ForegroundColor Cyan
Write-Host "Close the windows or run 'pnpm agents:stop' to stop all agents." -ForegroundColor Gray
