import Avatar from "@/components/Avatar";
import CustomButton from "@/components/CustomButton";
import CustomDatePicker, {
  add15Minutes,
  PickerData,
} from "@/components/CustomDatePicker";
import StoreStatus from "@/components/StoreStatusIndicator";
import { AppContext } from "@/context/AppContext";
import { ApiService } from "@/services/apiService";
import {
  checkIfStoreIsOpen,
  getNextStoreOpenTime,
} from "@/utils/checkIfStoreIsOpen";
import {
  configureNotification,
  requestPermissionsAsync,
  setNotification,
} from "@/utils/coonfigureNotification";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getCalendars } from "expo-localization";
import { useRouter } from "expo-router";
import moment from "moment-timezone";
import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";

const timezoneKey = "whichTimezone";

configureNotification();

const Home = () => {
  const router = useRouter();
  const { user, setAppState } = useContext(AppContext);
  const [usingLocalTime, setUsingLocalTime] = useState(true);
  const logOut = () => {
    setAppState?.({});
    setNotification("Logout action", "You are logged out");
    router.replace("/");
  };

  const [modal, setModal] = useState(false);

  const salutation = useMemo(() => {
    const calendars = getCalendars();
    const localTimeZone = calendars[0].timeZone || "";
    const localCity =
      localTimeZone.length > 0 ? localTimeZone.split("/")[1] : " ";

    const timezone = usingLocalTime ? localTimeZone : "America/New_York";

    const city = usingLocalTime ? localCity : "NYC";

    let greeting = "";

    const hour = moment().tz(timezone).hour();
    if (hour >= 5 && hour < 10) greeting = `Good Morning, ${city}!`;
    else if (hour >= 10 && hour < 12) greeting = `Late Morning Vibes! ${city}`;
    else if (hour >= 12 && hour < 17) greeting = `Good Afternoon, ${city}!`;
    else if (hour >= 17 && hour < 21) greeting = `Good Evening, ${city}!`;
    else greeting = `Night Owl in ${city}!`;

    return { greeting, localCity, timezone };
  }, [usingLocalTime]);

  const [selectionDetails, setSelectionDetails] = useState<PickerData>({
    time: [],
    date: moment().tz(salutation.timezone),
  });

  const handleModalClose = () => {
    setModal(false);
  };

  const [loading, setLoading] = useState(false);
  const [storeStatus, setStoreStatus] = useState(false);

  const determineIfStoreIsOpen = async () => {
    setLoading(true);
    try {
      const [storeTimes, overrides] = await Promise.all([
        ApiService.getStoreTimes(user?.token || ""),
        ApiService.getStoreOverrides(user?.token || ""),
      ]);

      if (storeTimes.e || overrides.e) {
        Alert.alert("Error occured while checking if store is open");
      }

      if (storeTimes?.res?.data && overrides.res?.data) {
        let response = checkIfStoreIsOpen(
          salutation.timezone,
          storeTimes?.res?.data || [],
          overrides?.res?.data || []
        );

        await setNotification(
          "Time to shop!!",
          "Store opens in one hour",
          getNextStoreOpenTime(
            salutation.timezone,
            storeTimes?.res.data || [],
            overrides.res.data || []
          )
            .subtract(1, "hour")
            .toDate()
        );

        setStoreStatus(response);
      }
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  useEffect(() => {
    determineIfStoreIsOpen();
  }, [usingLocalTime]);

  useEffect(() => {
    intialiseStorage();
  }, []);

  useEffect(() => {
    handleNotificationPermission();
  }, []);

  const handleNotificationPermission = async () => {
    const res = await requestPermissionsAsync();

    if (!res.granted) {
      Alert.alert("You have declined the Notifications permission");
    }
  };

  const intialiseStorage = async () => {
    try {
      let data = await AsyncStorage.getItem(timezoneKey);

      if (data === null) {
        await AsyncStorage.setItem(timezoneKey, "local");
      } else {
        if (data === "local") {
          setUsingLocalTime(true);
        } else {
          setUsingLocalTime(false);
        }
      }
    } catch (error) {
      Alert.alert("Could not fetch timezone preference data on device");
    }
  };

  const toggleTimezonePreference = async () => {
    let update = !usingLocalTime;
    setUsingLocalTime(update);
    await AsyncStorage.setItem(timezoneKey, update === false ? "nyc" : "local");
  };

  const getTime = () => {
    const hour = selectionDetails?.date?.hour() || 0;
    const minute = selectionDetails?.date?.minute() || 0;

    let currentTime = `${hour < 10 ? "0" : ""}${hour}:${
      minute < 10 ? "0" : ""
    }${minute}`;
    return `${currentTime} - ${add15Minutes(currentTime)}`;
  };

  return (
    <SafeAreaView style={styles.background}>
      {modal && (
        <CustomDatePicker
          value={selectionDetails}
          onSelect={(val) => {
            setSelectionDetails(val);
          }}
          timeZone={salutation.timezone}
          handleClose={handleModalClose}
          visible={modal}
          maxDays={30}
        />
      )}

      <View style={styles.wrapper}>
        <Avatar
          icon={user?.photo ?? undefined}
          name={user?.name ?? user?.email}
        />

        <Text style={styles.greeting}>{salutation.greeting}</Text>

        <View style={styles.greetingWrapper}>
          <Text style={styles.city}>{salutation.localCity}</Text>
          <Switch
            thumbColor={"black"}
            trackColor={{ false: "grey", true: "ash" }}
            value={!usingLocalTime}
            onChange={toggleTimezonePreference}
          />
          <Text style={styles.city}>NYC</Text>
        </View>
        <ScrollView>
          <View style={styles.dateTime}>
            <Text style={styles.day}>
              {selectionDetails?.date?.tz(salutation.timezone).format("LL")}
            </Text>
            <Text style={styles.time}>{getTime()}</Text>

            <CustomButton
              onPress={() => {
                setTimeout(() => setModal(!modal), 200);
              }}
              text={selectionDetails?.date ? "Edit" : "Set Date and Time"}
              style={styles.editButton}
            />
          </View>

          <View>
            <StoreStatus loading={loading} status={storeStatus} />
          </View>
        </ScrollView>
        <CustomButton
          disabled={false}
          text="Logout"
          style={styles.logout}
          onPress={logOut}
        />
      </View>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  wrapper: {
    height: "100%",
    width: "100%",
    paddingHorizontal: 10,
    backgroundColor: "#FBFFFE",
    paddingVertical: 20,
  },

  greeting: {
    fontSize: 20,
    marginTop: 20,
    fontWeight: "500",
  },

  email: {
    fontWeight: "800",
  },

  greetingWrapper: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 6,
  },

  city: {
    fontSize: 16,
  },

  dateTime: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#E5E4E2",
    marginVertical: 20,
    borderRadius: 12,
  },
  time: {
    fontSize: 20,
    marginTop: 20,
    fontWeight: "500",
    color: "black",
  },
  day: { fontSize: 18 },

  logout: {
    marginVertical: 20,
  },
  editButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    width: "auto",
    display: "flex",
    alignItems: "center",
    marginTop: 20,
  },
  background: {
    backgroundColor: "#FBFFFE",
  },
});
