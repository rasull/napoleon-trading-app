@echo off
cd /d "%~dp0"
if not exist "%~dp0chrome_agent_profile" mkdir "%~dp0chrome_agent_profile"

start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" --remote-debugging-port=9222 --remote-allow-origins=* --user-data-dir="%~dp0chrome_agent_profile" "https://members.masteryourtradingmindset.com/c/trading-psychology-mentorship-2-0"

timeout /t 3 /nobreak >nul

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0link_chrome.ps1"

echo Connected Port 9222 to AI Agent successfully!
pause
