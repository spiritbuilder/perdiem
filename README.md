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

## Current Limitations

- Google sign works well on ios, loads on android but does not return user details, you can test by using regular email and sign up with the credentials Email: `user@tryperdiem.com` and password `password`

- The app still uses the token issued by auth endpoint the credentials above to get token to fetch get store times and overrides

## Assumptions

- I saw that the store time weekdays start from 1 and not zero as per the api response. This meant that all all use cases of the day_of_week in `checkIfStoreIsOpen` were incremented by one.

- The app display current time based on the persisted timezone set by user. The default timezone is the user's local time. Flippinng the switch on the home screen toggles the time between the NYC time and User's local time. This also triggers a refresh of whether store is open or not.

- The App fetches store details when it is loaded and sets the next time the store opens. This was done because this could be dynamic in the future.

- The email of the user is used if user is authenticated via email since the api does not return a name at the development time

# Demo Video

[You can check this loom](https://www.loom.com/share/fb7388fdc467475c9ced77fa2cdc33d2)
