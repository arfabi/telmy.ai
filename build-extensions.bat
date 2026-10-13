@echo off
setlocal
echo Running Telmy Extension Packager for Chrome, Edge, and Firefox...
powershell -ExecutionPolicy Bypass -File "%~dp0build-extensions.ps1"
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Export failed with error code %ERRORLEVEL%.
    pause
    exit /b %ERRORLEVEL%
)
echo.
pause
