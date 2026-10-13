#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
if [ -x ./gradlew ]; then
  ./gradlew assembleDebug
elif command -v gradle >/dev/null 2>&1; then
  gradle assembleDebug
else
  echo "ERROR: Gradle wrapper is missing and Gradle is not installed." >&2
  echo "Open this project in Android Studio/Klencod IDE, or use the included GitHub Actions workflow." >&2
  exit 1
fi
echo "APK output: app/build/outputs/apk/debug/"
