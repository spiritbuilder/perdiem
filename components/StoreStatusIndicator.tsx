import React, { useEffect, useRef } from "react";
import {
  ActivityIndicator,
  Animated,
  Easing,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface StoreStatusProps {
  status?: boolean;
  loading?: boolean;
  firstLoaded?: boolean;
}

const StoreStatus = ({ status, loading, firstLoaded }: StoreStatusProps) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulse = () => {
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start(() => pulse());
    };

    pulse();

    return () => {
      pulseAnim.stopAnimation();
    };
  }, []);

  return (
    <View style={styles.container}>
      {loading && !firstLoaded ? (
        <ActivityIndicator accessibilityHint="loading" />
      ) : (
        <Animated.View
        testID={"orb"}
          style={[
            styles.orb,
            status ? styles.statusColor : styles.statusColorInactive,
            {
              transform: [{ scale: pulseAnim }],
            },
          ]}
        />
      )}

      <Text style={styles.text}>
        {loading && !firstLoaded
          ? "Checking if store is open"
          : status
          ? "🛒 Store Open"
          : "🔒 Store Closed"}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  orb: {
    width: 100,
    height: 100,
    borderRadius: 50,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 10,
  },

  statusColor: {
    backgroundColor: "#41dc83", // Sun yellow color
    shadowColor: "#41dc83",
  },

  statusColorInactive: {
    backgroundColor: "#FF2C2C", // Sun yellow color
    shadowColor: "#FF2C2C",
  },

  text: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 50,
  },
});

export default StoreStatus;
