@echo off
echo ========================================================
echo   ORKESTRIM 2K26 - FIREBASE HOSTING DEPLOYMENT
echo ========================================================
echo.

cd /d "%~dp0frontend"
echo [1/3] Building production bundle...
call npm run build
if %errorlevel% neq 0 (
    echo Error: Build failed.
    pause
    exit /b %errorlevel%
)

cd /d "%~dp0"
echo.
echo [2/3] Logging into Firebase...
call npx firebase-tools login

echo.
echo [3/3] Deploying to https://orkestrim-2k26.web.app...
call npx firebase-tools deploy --only hosting

echo.
echo ========================================================
echo   DEPLOYMENT COMPLETE!
echo   Visit: https://orkestrim-2k26.web.app
echo ========================================================
pause
