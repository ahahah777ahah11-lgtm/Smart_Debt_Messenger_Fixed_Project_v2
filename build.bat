@echo off
cd /d "%~dp0"
if exist gradlew.bat (
  call gradlew.bat assembleDebug
) else (
  where gradle >nul 2>nul
  if errorlevel 1 (
    echo ERROR: Gradle wrapper is missing and Gradle is not installed.
    echo Open this project in Android Studio/Klencod IDE or use GitHub Actions.
    exit /b 1
  )
  gradle assembleDebug
)
if errorlevel 1 exit /b %errorlevel%
echo APK output: app\build\outputs\apk\debug\
