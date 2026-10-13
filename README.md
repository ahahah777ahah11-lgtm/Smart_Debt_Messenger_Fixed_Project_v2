# Smart Debt Messenger — Android WebView project

## Included features
- Arabic RTL interface with customer creation, editing, searching and deletion.
- Locally stored customer records (WebView local storage).
- CSV import/export and JSON backup/restore.
- SMS and WhatsApp buttons that prepare a message for review; the user must send it manually.
- Android file picker support for CSV/JSON files.

## Build
Open this directory (`html-to-apk-builder`) in Klencod IDE / Android Studio and build the `app` module.
A GitHub Actions workflow is included. Upload the *contents of this directory* to the repository root, then run **Actions → Build Android APK**. Download the artifact after the workflow succeeds.

If using a terminal, install JDK 17 and Gradle 8.5, then run:
- Linux/macOS: `gradle assembleDebug`
- Windows: `gradle assembleDebug`

Output: `app/build/outputs/apk/debug/app-debug.apk`

## Important
This project does not include an already-built APK. Build it in Klencod/Android Studio/GitHub Actions.
Data is stored locally on the device and is not automatically synchronized. Export JSON backups regularly. CSV import expects columns in this order: customer name, phone, balance, notes. Excel (.xlsx) and PDF parsing are not implemented in this version.
