import * as Notifications from "expo-notifications";

// First, set the handler that will cause the notification
// to show the alert
const configureNotification = () => {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
};
function requestPermissionsAsync() {
  return Notifications.requestPermissionsAsync({
    ios: {
      allowAlert: true,
      allowBadge: true,
      allowSound: true,
    },
  });
}

async function setNotification(
  title: string,
  body: string,
  dateTime: Date | undefined = undefined
) {
  let _dateTime = dateTime ? dateTime : new Date();

  let notifications = await Notifications.getAllScheduledNotificationsAsync();

  let currentNotifications = notifications?.filter(
    (m) =>
      m.content.title === "Time to shop!!" &&
      title == m.content.title &&
      _dateTime.toISOString() === m.content.data?.date
  );

  if (currentNotifications.length > 0) {
    console.log(
      "already set will open at:",
      currentNotifications[0].content.data?.date,
      currentNotifications.length,
      notifications.length
    );
    return;
  }

  const timeaway = _dateTime.getTime() - new Date().getTime();

  return Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data: {
        date: _dateTime.toISOString(),
      },
    },
    trigger: dateTime
      ? {
          seconds: timeaway > 0 ? timeaway / 1000 : 0,
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          repeats: false,
        }
      : null,
  });
}

export { configureNotification, requestPermissionsAsync, setNotification };
