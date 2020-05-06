# Water Reminder

## Connect to phone
`yarn add expo` if expo not installed
`expo start --localhost --android`
`yarn install`

## Make .apk
`expo build:android`

When building for android you can choose to build APK (`expo build:android -t apk`) or Android App Bundle (`expo build:android -t app-bundle`). App bundles are recommended, but you have to make sure the Google Play App Signing is enabled for your project.
If you choose to let Expo generate a keystore for you, we strongly recommend that you later run `expo fetch:android:keystore` and backup your keystore to a safe location. **Once you submit an app to the Google Play Store, all future updates to that app must be signed with the same keystore to be accepted by Google.** If, for any reason, you delete your project or clear your credentials in the future, you will not be able to submit any updates to your app if you have not backed up your keystore.

## Install .apk
`cd` to the Android Platform Tools unzipped folder
`./adb install ../water-reminder-12345-signed.apk`