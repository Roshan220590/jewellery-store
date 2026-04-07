@echo off
echo ========================================
echo    R&S JEWELLERY - BACKUP SYSTEM
echo ========================================
echo.
echo This will create a complete backup of your website
echo before you make any changes.
echo.
echo Choose backup type:
echo.
echo 1. Quick Backup (Source Code Only)
echo 2. Complete Backup (Source + dist + docs)
echo 3. Automatic Daily Backup
echo 4. Restore from Backup
echo 5. Exit
echo.
set /p choice="Enter your choice (1-5): "

if "%choice%"=="1" (
    echo.
    echo Creating Quick Backup...
    echo.
    set timestamp=%date:~-4,4%%date:~-10,2%%date:~-7,2%_%time:~0,2%%time:~3,2%
    set timestamp=%timestamp: =0%
    
    if not exist "backups" mkdir backups
    
    echo Copying source files...
    xcopy "src" "backups\backup_%timestamp%\src" /E /I /H /Y >nul 2>&1
    xcopy "public" "backups\backup_%timestamp%\public" /E /I /H /Y >nul 2>&1
    copy "*.json" "backups\backup_%timestamp%\" >nul 2>&1
    copy "*.js" "backups\backup_%timestamp%\" >nul 2>&1
    copy "*.md" "backups\backup_%timestamp%\" >nul 2>&1
    copy "*.bat" "backups\backup_%timestamp%\" >nul 2>&1
    copy "*.html" "backups\backup_%timestamp%\" >nul 2>&1
    
    echo ✅ Quick Backup Complete!
    echo 📁 Location: backups\backup_%timestamp%
    echo 📋 Contains: Source code, config files, documentation
    echo.
    pause
)

if "%choice%"=="2" (
    echo.
    echo Creating Complete Backup...
    echo.
    set timestamp=%date:~-4,4%%date:~-10,2%%date:~-7,2%_%time:~0,2%%time:~3,2%
    set timestamp=%timestamp: =0%
    
    if not exist "backups" mkdir backups
    
    echo Copying all files...
    xcopy "*" "backups\backup_%timestamp%" /E /I /H /Y >nul 2>&1
    
    echo ✅ Complete Backup Complete!
    echo 📁 Location: backups\backup_%timestamp%
    echo 📋 Contains: Everything including dist folder
    echo.
    pause
)

if "%choice%"=="3" (
    echo.
    echo Setting up Automatic Daily Backup...
    echo.
    
    if not exist "backups\daily" mkdir backups\daily
    
    set timestamp=%date:~-4,4%%date:~-10,2%%date:~-7,2%
    
    echo Creating daily backup...
    xcopy "src" "backups\daily\daily_%timestamp%\src" /E /I /H /Y >nul 2>&1
    xcopy "public" "backups\daily\daily_%timestamp%\public" /E /I /H /Y >nul 2>&1
    copy "*.json" "backups\daily\daily_%timestamp%\" >nul 2>&1
    copy "*.js" "backups\daily\daily_%timestamp%\" >nul 2>&1
    
    echo ✅ Daily Backup Created!
    echo 📁 Location: backups\daily\daily_%timestamp%
    echo.
    echo 💡 To automate this, you can add this script to Windows Task Scheduler
    echo.
    pause
)

if "%choice%"=="4" (
    echo.
    echo Available Backups:
    echo.
    
    if not exist "backups" (
        echo ❌ No backups found!
        echo.
        pause
        exit
    )
    
    dir /b /ad "backups" | findstr /v "^."
    
    echo.
    set /p backupname="Enter backup folder name to restore (or type 'cancel'): "
    
    if /i "%backupname%"=="cancel" (
        echo Cancelled.
        pause
        exit
    )
    
    if not exist "backups\%backupname%" (
        echo ❌ Backup not found!
        pause
        exit
    )
    
    echo.
    echo ⚠️  WARNING: This will replace current files with backup!
    echo Are you sure? (Y/N)
    set /p confirm="> "
    
    if /i not "%confirm%"=="Y" (
        echo Cancelled.
        pause
        exit
    )
    
    echo Restoring from backup...
    xcopy "backups\%backupname%\*" ".\" /E /I /H /Y >nul 2>&1
    
    echo ✅ Restore Complete!
    echo 🔄 Website restored from: %backupname%
    echo.
    pause
)

if "%choice%"=="5" (
    echo.
    echo Goodbye!
    exit
)

echo.
echo ========================================
echo    📋 BACKUP TIPS
echo ========================================
echo.
echo ✅ Always backup before making changes
echo ✅ Test changes locally before deploying
echo ✅ Keep multiple backup versions
echo ✅ Label backups clearly (e.g., "before_price_update")
echo ✅ Store backups in multiple locations
echo.
echo 📁 Your backups are stored in the "backups" folder
echo 🕒 Backups are timestamped automatically
echo 🔄 You can restore any backup anytime
echo.
pause
