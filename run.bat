@echo off
setlocal enabledelayedexpansion

:: Check if port 3000 is available
echo Checking if port 3000 is available...

:checkPort
timeout /t 1 >nul
netstat -aon | findstr ":3000" >nul
if errorlevel 1 (
    echo Port 3000 is available. Starting server...
    start cmd /k "npm start"
    
    :: Wait for the server to start
    timeout /t 5 >nul
    echo Opening browser at http://localhost:3000
    start http://localhost:3000
) else (
    echo Port 3000 is already in use. Opening browser...
    start http://localhost:3000
)

exit /b
