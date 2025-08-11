import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";

interface CustomInputProps {
  label?: string;
  textInputProps?: TextInputProps;
  error?: string;
}

const CustomInput = ({ label, textInputProps, error }: CustomInputProps) => {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <TextInput style={styles.input} {...textInputProps} />
      <Text style={styles.error}>{error}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 12,
    fontSize: 20,
    marginTop: 6,
  },
  wrapper: {
    width: "100%",
  },
  label: {
    fontSize: 16,
  },
  error: {
    fontSize: 12,
    color: "red",
  },
});

export default CustomInput;
