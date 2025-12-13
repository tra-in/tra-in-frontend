import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { Colors } from "../constants/theme";

export default function WaypointActionButton({ onPress }) {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <Text style={styles.text}>길찾기</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderColor: Colors.korailSilver,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginLeft: 10, // align with card
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  text: {
    color: Colors.korailGray,
    fontSize: 12,
    fontWeight: "500",
  },
});
