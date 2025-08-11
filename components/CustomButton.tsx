import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";

interface CustomButtonProps extends TouchableOpacityProps {
  text?: string;
  loading?: boolean;
}
const CustomButton = ({
  text,
  loading,
  style: propStyle,
  ...rest
}: CustomButtonProps) => {
  return (
    <TouchableOpacity
      style={[
        {
          ...styles.touchable,
          ...(propStyle && (propStyle as CustomButtonProps)),
        },
        rest?.disabled ? styles.inActive : styles.active,
        ,
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator size={"large"} color={"white"} />
      ) : (
        <Text style={styles.text}>{text}</Text>
      )}
    </TouchableOpacity>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  text: {
    fontSize: 20,
    textAlign: "center",
    color: "white",
  },
  touchable: {
    width: "100%",

    borderRadius: 12,
    padding: 10,
  },
  active: { backgroundColor: "black" },
  inActive: { backgroundColor: "grey" },
});
