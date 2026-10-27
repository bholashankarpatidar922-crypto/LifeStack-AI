# Building the LifeStack Android Application (Capacitor)

LifeStack uses [Capacitor](https://capacitorjs.com/) to wrap the responsive React/Vite PWA into an installable Android APK and production-ready signed Android App Bundle (AAB).

---

## 1. Prerequisites
- **Node.js**: v18+ (verified on v24)
- **Java Development Kit (JDK)**: JDK 17 or JDK 21
- **Android Studio**: Ladybug / Iguana or higher with Android SDK Platform 34 installed
- **Android SDK Build-Tools**: 34.0.0+

---

## 2. Generate and Sync the Android Project

From the project root or `apps/web`:
```bash
# 1. Build the production web bundle
cd apps/web
npm run build

# 2. Add the Android platform (first time only)
npx cap add android

# 3. Sync web assets and plugins to the native project
npx cap sync android
```

---

## 3. Local Development & Emulator Testing

To launch the project in Android Studio:
```bash
npx cap open android
```
In Android Studio:
1. Select an emulator (e.g., Pixel 8 Pro - API 34).
2. Click **Run** (`Shift + F10`) to build the debug APK and launch LifeStack on device.

---

## 4. Producing a Production Signed Android App Bundle (AAB)

To release on the Google Play Store:
1. Generate your release keystore (keep this private):
   ```bash
   keytool -genkey -v -keystore lifestack-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias lifestack-key
   ```
2. Place `lifestack-release-key.jks` in `android/app/` (or reference via environment variables).
3. Update `android/app/build.gradle` with your signing configuration:
   ```groovy
   signingConfigs {
       release {
           storeFile file("lifestack-release-key.jks")
           storePassword System.getenv("KEYSTORE_PASSWORD")
           keyAlias "lifestack-key"
           keyPassword System.getenv("KEY_PASSWORD")
       }
   }
   buildTypes {
       release {
           signingConfig signingConfigs.release
           minifyEnabled true
           proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
       }
   }
   ```
4. Build the release bundle:
   ```bash
   cd android
   ./gradlew bundleRelease
   ```
   The generated artifact will be at:
   `android/app/build/outputs/bundle/release/app-release.aab`
