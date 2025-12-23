# Baatein: Next.js to Expo Migration Guide

This guide provides a detailed roadmap for migrating the **Baatein** (Next.js) project into a cross-platform mobile application using **Expo**.

---

## 1. Overview

Next.js and Expo share many conceptual similarities (file-based routing, React-based), but they differ fundamentally in how they render UI and handle platform APIs.

| Feature           | Next.js (Current)         | Expo (Target)                             |
| :---------------- | :------------------------ | :---------------------------------------- |
| **Framework**     | Next.js 16 (App Router)   | Expo SDK 52+ (Expo Router)                |
| **Rendering**     | SSR / RSC                 | Client-side Native                        |
| **UI Components** | HTML (`div`, `p`, `span`) | Core Components (`View`, `Text`, `Image`) |
| **Styling**       | Tailwind CSS              | NativeWind (Tailwind for Native)          |
| **Navigation**    | `next/navigation`         | `expo-router`                             |
| **Database/Auth** | `@supabase/ssr`           | `@supabase/supabase-js` + `AsyncStorage`  |

---

## 2. Setting Up the Expo Project

### Initialize Expo

Create a new Expo project using the tabs template (closest to a structured app):

```bash
npx create-expo-app@latest baatein-mobile --template tabs-navigation
cd baatein-mobile
```

### Install Core Dependencies

```bash
npx expo install @supabase/supabase-js @react-native-async-storage/async-storage react-native-url-polyfill nativewind tailwindcss lucide-react-native framer-motion-react-native expo-standard-web-crypto
```

---

## 3. Navigation Migration (Expo Router)

Expo Router uses a file-based system similar to Next.js App Router.

- **Next.js**: `app/journal/page.tsx` → **Expo**: `app/journal/index.tsx`
- **Next.js**: `app/journal/[id]/page.tsx` → **Expo**: `app/journal/[id].tsx`
- **Next.js**: `layout.tsx` → **Expo**: `_layout.tsx`

### Example: Layout Migration

Instead of `children` prop, Expo Router uses the `<Slot />` or `<Stack />` component.

```tsx
// app/_layout.tsx (Expo)
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="journal/index" />
    </Stack>
  );
}
```

---

## 4. UI & Styling (NativeWind)

You cannot use standard HTML tags. You must map them to React Native components.

### Component Mapping

- `<div>` → `<View>`
- `<span>`, `<p>`, `<h1>` → `<Text>`
- `<img>` → `<Image>` (or `expo-image`)
- `<button>` → `<TouchableOpacity>` or `<Pressable>`

### Tailwind to NativeWind

Configure NativeWind to use your existing Tailwind design system. In `tailwind.config.js`:

```js
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      // Copy your colors/fonts from the Next.js project here
    },
  },
  plugins: [],
};
```

---

## 5. Supabase & Authentication

Native environments require a manual persistence layer and a URL polyfill.

### Client Configuration

```typescript
// lib/supabase.ts
import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
```

---

## 6. Porting Encryption (`lib/crypto.ts`)

Since React Native does not support `window.crypto.subtle` natively, use `expo-standard-web-crypto`.

### Polyfill Setup

In your entry file (`app/_layout.tsx`):

```typescript
import * as crypto from "expo-standard-web-crypto";

if (!global.crypto) {
  global.crypto = crypto;
}
```

Now your existing `crypto.ts` logic can be ported with minimal changes (replacing `btoa`/`atob` with `base64-js` if needed, as these aren't global in RN).

---

## 7. Handling Rich Text (TipTap)

TipTap is built for the DOM. For Expo, you have two main options:

1.  **WebView Implementation**: Use `react-native-webview` to host the TipTap editor. This lets you keep your exact code.
2.  **Native Editor**: Switch to a native-first library like `react-native-pigeon-editor` or `expo-pigeon`.

_Recommendation: Start with a WebView implementation to preserve the complex TipTap logic for the Journal._

---

## 8. Checklist for Migration

1.  [ ] **Constants**: Move `.env.local` to `.env` (using `EXPO_PUBLIC_` prefix).
2.  [ ] **Assets**: Move images from `public/` to `assets/`.
3.  [ ] **Hooks**: `useRouter` from `next/navigation` → `useRouter` from `expo-router`.
4.  [ ] **State**: Framer Motion is partially supported via `framer-motion-react-native` or `moti`.
5.  [ ] **Biometrics**: Add `expo-face-id` if you want to protect the journal with local biometrics (bonus for mobile!).

---

## 9. Deployment (EAS)

Use Expo Application Services (EAS) to build binaries:

```bash
npm install -g eas-cli
eas build:configure
eas build --platform ios
eas build --platform android
```
