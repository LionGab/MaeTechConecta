@echo off
echo ====================================
echo Copiando configuracoes para Cursor
echo ====================================

set "SOURCE=%CD%\.vscode"
set "CURSOR_CONFIG=%APPDATA%\Cursor\User"

if not exist "%CURSOR_CONFIG%" (
    echo Criando pasta de configuracao do Cursor...
    mkdir "%CURSOR_CONFIG%"
)

echo.
echo Copiando settings.json...
copy /Y "%SOURCE%\settings.json" "%CURSOR_CONFIG%\settings.json"

echo.
echo Copiando extensions.json para snippets...
if not exist "%CURSOR_CONFIG%\snippets" mkdir "%CURSOR_CONFIG%\snippets"

echo.
echo ====================================
echo Configuracoes copiadas com sucesso!
echo ====================================
echo.
echo Reinicie o Cursor para aplicar as configuracoes.
echo.
pause
