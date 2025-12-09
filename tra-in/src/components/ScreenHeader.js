import React from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { screenStyles } from "../constants/screenStyles";

/**
 * Reusable header component used across all screens
 */
const ScreenHeader = ({ title = "트레:in(人)" }) => {
  return (
    <View style={screenStyles.header}>
      <Text style={screenStyles.headerTitle}>{title}</Text>
      <TouchableOpacity style={screenStyles.menuButton}>
        <Text style={screenStyles.menuText}>☰</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ScreenHeader;
