# Função para detectar browser ativo no Windows
function Get-ActiveBrowser {
    $browsers = @{
        'chrome' = @{
            'name' = 'Chrome'
            'path' = 'C:\Program Files\Google\Chrome\Application\chrome.exe'
            'icon' = '🌐'
        }
        'msedge' = @{
            'name' = 'Edge'
            'path' = 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
            'icon' = '🔷'
        }
        'firefox' = @{
            'name' = 'Firefox'
            'path' = 'C:\Program Files\Mozilla Firefox\firefox.exe'
            'icon' = '🦊'
        }
        'brave' = @{
            'name' = 'Brave'
            'path' = "$env:LOCALAPPDATA\BraveSoftware\Brave-Browser\Application\brave.exe"
            'icon' = '🦁'
        }
    }

    # Verificar qual browser está instalado
    $activeBrowser = $null
    foreach ($key in $browsers.Keys) {
        $browser = $browsers[$key]
        if (Test-Path $browser.path) {
            $activeBrowser = $browser
            $activeBrowser['key'] = $key
            break
        }
    }

    # Se não encontrou nos caminhos padrão, verificar pelo processo
    if (-not $activeBrowser) {
        $processes = @('chrome', 'msedge', 'firefox', 'brave')
        foreach ($proc in $processes) {
            $running = Get-Process -Name $proc -ErrorAction SilentlyContinue
            if ($running) {
                $activeBrowser = @{
                    'name' = $proc
                    'icon' = '🌐'
                    'key' = $proc
                    'running' = $true
                }
                break
            }
        }
    }

    # Verificar se há processo do browser rodando
    if ($activeBrowser) {
        $processName = $activeBrowser.key
        $running = Get-Process -Name $processName -ErrorAction SilentlyContinue
        if ($running) {
            $activeBrowser['running'] = $true
            $activeBrowser['tabs'] = (Get-Process -Name $processName).Count
        } else {
            $activeBrowser['running'] = $false
        }
    }

    return $activeBrowser
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

# Exportar funções
Export-ModuleMember -Function Get-ActiveBrowser, Format-BrowserPrompt
