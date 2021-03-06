import { Notifications } from "expo";

import * as Database from "./Database";

const reminders = [
  "Be a superstar, drink water now",
  "Drink some damn water",
  "What's wrong with you, drink water",
  "Think you're too good for water?!?",
  "Only losers don't drink water",
  "Coffee doesn't count, chug a water",
  "Drink a water for every 2 coffees you've had",
  "Dismiss this message if you're a bitch",
  "Do not dismiss before drinking water",
  "Hurry up, just drink a water",
  "You might as well drink a glass a water",
  "Drink a quick glass of water or fuck off"
];

export const addReminderListener = (handleReminder) => {
  return Notifications.addListener(handleReminder);
}

export const queueReminder = async (reminderTime, repeatFreq = '') => {
  if (Platform.OS === "android") {
    await Notifications.createChannelAndroidAsync("water-reminder", {
      name: "Water Reminder",
      sound: true,
    });
  }

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
      channelId: "water-reminder",
      icon:
        "https://cdn0.iconfinder.com/data/icons/orderdrinks/128/C_WaterGlss-512.png",
      color: "purple",
      androidMode: "collapse",
    },
  };

  const schedulingOptions = {
    time: reminderTime
  };

  if (repeatFreq) {
    schedulingOptions['repeat'] = repeatFreq;
  }
  
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

// howOften = 1 for every hour, = 3 for every 3h
export const queueNonRecurringTodayReminders = async (howOften) => {
  if (howOften == 0) {
    console.log(`Queued 0 new reminders for today`);
    return;
  }
  const anHour = 1000 * 60 * 60 * howOften;
  const rightNow = new Date();
  const startTime = rightNow.getHours();
  const endTime = parseInt((await Database.querySetting("endTime")).substring(0,2))
  const occurrences = Math.floor((endTime - startTime) / howOften); 

  for (let i = 0; i < occurrences; i++) {
    // has to be in the future, so add 3 seconds
    let reminderTime = (rightNow.getTime() + 3000) + (anHour * i);
    await queueReminder(reminderTime);
  }
  console.log(`Queued ${occurrences} reminders for today`);
};

// howOften = 1 for every hour, = 3 for every 3h
export const queueRecurringTomorrowReminders = async (howOften) => {
  if (howOften == 0) {
    console.log(`Queued 0 new reminders starting tomorrow`);
    return;
  }
  const anHour = 1000 * 60 * 60 * howOften;
  const settings = await Database.queryAllSettings();
  const startTime = parseInt(settings.startTime.substring(0, 2));
  const endTime = parseInt(settings.endTime.substring(0, 2));
  const occurrences = Math.floor((endTime - startTime) / howOften); 
  
  const tomorrow = new Date ()
  tomorrow.setDate(new Date().getDate() + 1);
  tomorrow.setHours(startTime, 0, 0, 0);
    
  for (let i = 0; i < occurrences; i++) {
    let reminderTime = tomorrow.getTime() + anHour * i;
    await queueReminder(reminderTime, "day");
  }
  console.log(`Queued ${occurrences} new reminders starting tomorrow`);
};
