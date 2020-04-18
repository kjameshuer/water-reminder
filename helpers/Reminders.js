import { Notifications } from "expo";
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';

const reminders = [
  "Be a superstar, drink water now",
  "Drink some damn water",
  "What's wrong with you, drink water",
  "Think you're too good for water?!?",
  "Only losers don't drink water",
];

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

export const reminderListener = (handleReminder) => {
  return Notifications.addListener(handleReminder);
}

export const queueReminder = async (reminderTime) => {
  const localNotification = {
    title: "Gotta Drink, Bitch",
    body: reminders[Math.floor(Math.random() * reminders.length)],
    data: {
      dater: "lore",
    },
    ios: {
      sound: true,
    },
    android: {
      channelId: "default",
      icon:
        "https://cdn0.iconfinder.com/data/icons/orderdrinks/128/C_WaterGlss-512.png",
      color: "purple",
    },
  };

  const schedulingOptions = {
    time: reminderTime,
    // repeat: 'minute'
  };

  let reminderId = await Notifications.scheduleLocalNotificationAsync(
    localNotification,
    schedulingOptions
  );
  return reminderId;
};

export const deleteAllQueuedReminders = async () => {
  await Notifications.cancelAllScheduledNotificationsAsync();
  console.log("Cancelled all reminders")
}

export const queueHourlyReminders = async (daysDelayed) => {
  const anHour = 1000 * 60 * 60;
  const rightNow = new Date();
  const hoursBeforeBedtime = 22 - rightNow.getHours();
  
  for (let i = 1; i <= hoursBeforeBedtime; i++) {
    let reminderTime = rightNow.getTime() + (anHour * i);
    await queueReminder(reminderTime);
  }
  console.log(`Queued ${hoursBeforeBedtime} new reminders`)
};
