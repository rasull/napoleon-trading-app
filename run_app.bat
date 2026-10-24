@echo off
cd /d "%~dp0"
set "APP_URL=file:///%CD:\=/%/index.html"

where msedge >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    start "" msedge --app="%APP_URL%" --window-size=1400,880
    exit /b 0
)

if exist "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" (
    start "" "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --app="%APP_URL%" --window-size=1400,880
    exit /b 0
)

if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" (
    start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" --app="%APP_URL%" --window-size=1400,880
    exit /b 0
)

start "" "%CD%\index.html"
