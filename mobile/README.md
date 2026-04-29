# Golden Edge Analytics Mobile

Expo wrapper app for the Golden Edge Analytics hub. The website remains the source of truth for UI and content; this app adds a native shell, WebView, splash/icon configuration, and push notification plumbing.

## Structure

```text
mobile/
  app.json
  eas.json
  package.json
  assets/
  src/
    App.tsx
    components/
      LoadingOverlay.tsx
      NativeHeader.tsx
      WebErrorState.tsx
    config/
      sites.ts
    hooks/
      usePushNotifications.ts
    screens/
      NotificationsScreen.tsx
    services/
      notifications.ts
      pushTokenRegistration.ts
```

## Configure

Set the wrapped website URL when needed:

```bash
EXPO_PUBLIC_GEA_SITE_URL="https://goldenedgeanalytics-traderoi.vercel.app/"
```

Set this later when you have a backend endpoint ready to store Expo push tokens:

```bash
EXPO_PUBLIC_PUSH_TOKEN_REGISTRATION_URL="https://your-api.example.com/mobile/push-tokens"
```

Create/link the EAS project so Expo can add the real project ID to `app.json`:

```bash
npx eas init
```

## Run Locally

Install dependencies:

```bash
cd mobile
npm install
```

Start Metro for a development build:

```bash
npm run start
```

Create development builds:

```bash
npm run build:android -- --profile development
npm run build:ios -- --profile development
```

Remote push notifications require a physical device and a development build. Expo Go is not the target for remote push testing.

## Notifications

The app:

- requests notification permission
- configures the Android `vgk-updates` notification channel
- creates an Expo push token with the EAS project ID
- optionally posts the token to `EXPO_PUBLIC_PUSH_TOKEN_REGISTRATION_URL`
- includes a local notification test button
- is organized for future remote alert categories: game start, final score, new update, and breaking news

## Build

Production builds use EAS:

```bash
npm run build:android -- --profile production
npm run build:ios -- --profile production
```

Before store builds, configure Android FCM credentials and iOS push credentials in EAS.
