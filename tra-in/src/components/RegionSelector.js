import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Colors, Spacing, BorderRadius } from "../constants/theme";

/**
 * 지역 선택 버튼 컴포넌트
 * @param {string} region - 선택된 지역 이름
 * @param {function} onPress - 클릭 핸들러
 */
const RegionSelector = ({ region, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Text style={styles.text}>{region}</Text>
      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    paddingVertical: 12,
    paddingHorizontal: Spacing.md,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  text: {
    fontSize: 15,
    fontWeight: "500",
    color: Colors.black,
    marginRight: 4,
    fontFamily: "System",
  },
  arrow: {
    fontSize: 20,
    color: Colors.korailGray,
  },
});

export default RegionSelector;
