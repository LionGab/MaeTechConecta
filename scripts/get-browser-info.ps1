# Função para detectar browser ativo no Windows
function Get-ActiveBrowser {
    $browsers = @{
        'chrome' = @{
            'name' = 'Chrome'
            'paths' = @(
                'C:\Program Files\Google\Chrome\Application\chrome.exe',
                'C:\Program Files (x86)\Google\Chrome\Application\chrome.exe',
                "$env:LOCALAPPDATA\Google\Chrome\Application\chrome.exe"
            )
            'icon' = '🌐'
            'process' = 'chrome'
        }
        'msedge' = @{
            'name' = 'Edge'
            'paths' = @(
                'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe',
                'C:\Program Files\Microsoft\Edge\Application\msedge.exe'
            )
            'icon' = '🔷'
            'process' = 'msedge'
        }
        'firefox' = @{
            'name' = 'Firefox'
            'paths' = @(
                'C:\Program Files\Mozilla Firefox\firefox.exe',
                'C:\Program Files (x86)\Mozilla Firefox\firefox.exe'
            )
            'icon' = '🦊'
            'process' = 'firefox'
        }
        'brave' = @{
            'name' = 'Brave'
            'paths' = @(
                "$env:LOCALAPPDATA\BraveSoftware\Brave-Browser\Application\brave.exe",
                'C:\Program Files\BraveSoftware\Brave-Browser\Application\brave.exe'
            )
            'icon' = '🦁'
            'process' = 'brave'
        }
    }

    # Primeiro, verificar processos rodando (prioridade)
    foreach ($key in $browsers.Keys) {
        $browser = $browsers[$key]
        $processName = $browser.process
        $running = Get-Process -Name $processName -ErrorAction SilentlyContinue
        if ($running) {
            $activeBrowser = @{
                'name' = $browser.name
                'icon' = $browser.icon
                'key' = $key
                'running' = $true
                'process' = $processName
            }
            return $activeBrowser
        }
    }

    # Se nenhum processo rodando, verificar qual está instalado
    foreach ($key in $browsers.Keys) {
        $browser = $browsers[$key]
        foreach ($path in $browser.paths) {
            if (Test-Path $path) {
                $activeBrowser = @{
                    'name' = $browser.name
                    'icon' = $browser.icon
                    'key' = $key
                    'running' = $false
                    'process' = $browser.process
                }
                return $activeBrowser
            }
        }
    }

    # Nenhum browser encontrado
    return $null
}

# Função para formatar info do browser no prompt
function Format-BrowserPrompt {
    $browser = Get-ActiveBrowser
    if ($browser) {
        $status = if ($browser.running) { '🟢' } else { '⚪' }
        return "$($browser.icon) $($browser.name) $status"
    }
    return ''
}
