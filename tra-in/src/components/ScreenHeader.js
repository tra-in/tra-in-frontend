import React from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { screenStyles } from "../constants/screenStyles";

/**
 * Reusable header component used across all screens
 */
const ScreenHeader = ({ title = "트레:in(人)", showBackButton = false, onBackPress }) => {
  return (
    <View style={screenStyles.header}>
      {showBackButton && (
        <TouchableOpacity style={screenStyles.backButton} onPress={onBackPress}>
          <Text style={screenStyles.backButtonText}>←</Text>
        </TouchableOpacity>
      )}
      <Text style={screenStyles.headerTitle}>{title}</Text>
      <TouchableOpacity style={screenStyles.menuButton}>
        <Text style={screenStyles.menuText}>☰</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ScreenHeader;
