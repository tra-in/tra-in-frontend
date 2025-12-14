import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Colors } from "../constants/theme";

export default function WaypointActionButton({ onPress, style }) {
  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <Text style={styles.text}>길찾기</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderColor: Colors.korailSilver,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: Colors.white,
  },
  text: {
    color: Colors.korailGray,
    fontSize: 12,
    fontWeight: "500",
  },
});
