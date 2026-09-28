@echo off
rem Startet den Inhalte-Editor mit den Werkzeugen aus %LOCALAPPDATA%\Ballettschule (siehe install-windows.ps1).
rem Wird von der Verknuepfung "Website bearbeiten" aufgerufen.
title Website bearbeiten
setlocal
if defined BH_HOME (set "TOOLS=%BH_HOME%") else (set "TOOLS=%LOCALAPPDATA%\Ballettschule")
set "PATH=%TOOLS%\bin;%TOOLS%\node;%TOOLS%\git\cmd;%PATH%"
set "COREPACK_ENABLE_DOWNLOAD_PROMPT=0"
chcp 65001 >nul
cd /d "%~dp0.."

where node >nul 2>nul || goto missing
where yarn >nul 2>nul || goto missing

node scripts\cms.mjs %*
if errorlevel 1 pause
exit /b %errorlevel%

:missing
echo.
echo   X Die Werkzeuge fehlen. Bitte die Einrichtung noch einmal ausfuehren (siehe Anleitung).
echo.
pause
exit /b 1
