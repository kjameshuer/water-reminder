import { Vibration } from 'react-native';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';

export const registerForPushNotificationsAsync = async () => {
  if (Constants.isDevice) {
    const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      console.log("existingstatus not granted: ", existingStatus)
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      console.log("finalstatus not granted: ", finalStatus)
      console.log('Failed to get push token for push notification!');
      return;
    }
    token = await Notifications.getExpoPushTokenAsync();
    console.log("notification token **: ", token);
    return token;
  } else {
    console.log('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.createChannelAndroidAsync('default', {
      name: 'default',
      sound: true,
      priority: 'max',
      vibrate: [0, 250, 250, 250],
    });
  }
};

export const notificationListener = () => {
  // return Notifications.addListener(handleNotification)
}

// Handle notifications that are received or selected while the app
// is open. If the app was closed and then opened by tapping the
// notification (rather than just tapping the app icon to open it),
// this function will fire on the next tick after the app starts
// with the notification data.
const handleNotification = notification => {
  console.log("set i guess")
  Vibration.vibrate();
  console.log(notification);
  setNotification(notification);
};