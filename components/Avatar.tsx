import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

const placeholder = require("../assets/images/cool-emoji.png");

interface AvatarProps {
  icon?: string;
  name?: string;
}

const Avatar = ({ icon, name }: AvatarProps) => {
  return (
    <View style={styles.container}>
      <Image
        accessibilityHint="image"
        source={icon ? { uri: icon } : placeholder}
        style={styles.image}
      />
      <Text style={styles.text}>{name}</Text>
    </View>
  );
};

export default Avatar;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    gap: 6,
    alignItems: "center",
    flexDirection: "row",
    width: "100%",
  },

  image: {
    borderRadius: 20,
    width: 40,
    height: 40,
  },

  text: {
    fontWeight: "800",
    fontSize: 16,
    textTransform: "capitalize",
  },
});
