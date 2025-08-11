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
  dateTime: Date = new Date()
) {
  let notifications = await Notifications.getAllScheduledNotificationsAsync();


  let currentNotifications = notifications?.filter(
    (m) =>
      m.content.title === "Time to shop!!" &&
      title == m.content.title &&
      dateTime.toISOString() === m.content.data?.date
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

  return Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data: {
        date: dateTime.toISOString(),
      },
    },
    trigger: {
      date: new Date(dateTime.getTime() + 100),
      type: Notifications.SchedulableTriggerInputTypes.DATE,
    },
  });
}

export { configureNotification, requestPermissionsAsync, setNotification };
