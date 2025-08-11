import moment from "moment-timezone";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export interface PickerData {
  date?: moment.Moment;
  time: string[];
}

interface Props {
  maxDays?: number;
  timeZone: string;
  handleClose: () => void;
  onSelect: (val: PickerData) => void;
  value: PickerData;
  visible: boolean;
}

export const add15Minutes = (item: string = "00:00") => {
  let left = parseInt(item.split(":")[0]);
  let right = parseInt(item.split(":")[1]);
  if (right + 15 >= 60) {
    left += 1;
    right = (right + 15) % 60;
  } else {
    right += 15;
  }

  return `${left < 10 ? 0 : ""}${left}:${right < 10 ? 0 : ""}${right}`;
};

const CustomDatePicker = ({
  maxDays = 30,
  timeZone,
  handleClose,
  onSelect,
  value,
  visible,
}: Props) => {
  const data = useMemo(() => {
    let arr = [];
    let timeSlots = ["00:00"];
    let today = moment()
      .tz(timeZone || "")
      .startOf("day");
    for (let i = 0; i < maxDays; i++) {
      arr.push(today.clone());
      today = today.add(1, "day");
    }
    let lastItem = timeSlots[timeSlots.length - 1];

    while (lastItem !== "23:45") {
      const newTime = add15Minutes(lastItem);

      timeSlots.push(newTime);

      lastItem = newTime;
    }

    return { dates: arr, timeSlots };
  }, [timeZone, maxDays, value, visible]);

  const [viewing, setViewing] = useState<"date" | "time">("date");

  return (
    <>
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={handleClose}
      >
        <SafeAreaView style={styles.wrapper}>
          <View style={styles.wrapper}>
            <View style={styles.topContainer}>
              <TouchableOpacity onPress={handleClose}>
                <Text>Close</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.title}>
              Select a {value?.date ? "Time slot" : "Date"}
            </Text>
            {viewing === "time" ? (
              <FlatList
                style={styles.list}
                keyExtractor={(_, index) => `${index}`}
                data={data.timeSlots}
                renderItem={({ item, index }) => {
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        let update = value?.date
                          ?.clone()
                          .startOf("day")
                          .add(parseInt(item.split(":")[0]), "hour");

                        update?.add(parseInt(item.split(":")[1]), "minute");

                        onSelect({
                          date: update,
                          time: [item, add15Minutes(item)],
                        });
                        handleClose();
                      }}
                      style={styles.day}
                    >
                      <Text>
                        {item} - {add15Minutes(item)}
                      </Text>
                    </TouchableOpacity>
                  );
                }}
              />
            ) : (
              <FlatList
                style={styles.list}
                data={data.dates}
                keyExtractor={(_, index) => `${index}`}
                renderItem={({ item, index }) => {
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        onSelect({
                          ...value,
                          date: item.clone()?.startOf("day"),
                        });
                        setViewing("time");
                      }}
                      style={styles.day}
                    >
                      <Text>{item?.format("LL") || ""}</Text>
                    </TouchableOpacity>
                  );
                }}
              />
            )}
          </View>
        </SafeAreaView>
      </Modal>
    </>
  );
};

export default CustomDatePicker;

const styles = StyleSheet.create({
  day: {
    display: "flex",
    alignItems: "center",
    marginVertical: 10,
    borderWidth: 2,
    borderRadius: 10,
    paddingVertical: 12,
  },
  list: {
    gap: 20,
  },

  title: {
    fontSize: 30,
    marginVertical: 20,
    textAlign: "center",
    fontWeight: 600,
  },

  wrapper: {
    padding: 12,
    height: "100%",
    width: "100%",
    backgroundColor: "#FBFFFE",
  },
  topContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
});
