# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

You need to have the following install on your machine before you can proceeed to build this app.
- Node 22+
- Xcode
- Android Studio - Make sure to update your sdk, command line tools and platform API

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Prebuild the app

   ```bash
   npx expo prebuild --clean
   ```

3. Run the app

   ```bash
   npx expo run:ios
   ```

   OR

   ```bash
   npx expo run:android
   ```

## Current Limitation
 - Google sign works well on ios,  loads on android but does not return user details, you can test by using regular email and sign up with the credentials Email: `user@tryperdiem.com` and password `password`

 - The app still uses the token issued by auth endpoint the credentials above to get token to fetch get store times and overrides


# Demo Video

[You can check this loom](https://www.loom.com/share/fb7388fdc467475c9ced77fa2cdc33d2)








