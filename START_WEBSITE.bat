@echo off
echo ========================================
echo    R&S JEWELLERY WEBSITE MANAGER
echo ========================================
echo.
echo 1. Start Development Server
echo 2. Build for Production
echo 3. Preview Production Build
echo 4. Exit
echo.
set /p choice="Enter your choice (1-4): "

if "%choice%"=="1" (
    echo.
    echo Starting development server...
    echo Website will open at: http://localhost:5173
    echo.
    echo Press Ctrl+C to stop the server
    echo.
    npm run dev
)

if "%choice%"=="2" (
    echo.
    echo Building website for production...
    echo.
    npm run build
    echo.
    echo Build complete! Check the 'dist' folder.
    echo Upload 'dist' folder to your hosting provider.
    echo.
    pause
)

if "%choice%"=="3" (
    echo.
    echo Building and previewing production version...
    echo.
    npm run build
    npm run preview
)

if "%choice%"=="4" (
    echo.
    echo Goodbye!
    exit
)

pause
