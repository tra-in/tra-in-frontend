import React from "react";
import { View, TouchableOpacity, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { screenStyles } from "../constants/screenStyles";
import { ArrowLeftIcon } from "./Icons";
import { MaterialIcons } from "@expo/vector-icons";

const ScreenHeader = ({ showBackButton = false, onBackPress, onMenuPress }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[screenStyles.header, { paddingTop: insets.top }]}>
      <View style={screenStyles.headerInner}>
        {showBackButton && (
          <TouchableOpacity
            style={screenStyles.backButton}
            onPress={onBackPress}
            activeOpacity={0.7}
          >
            <ArrowLeftIcon color="#1F3A5F" />
          </TouchableOpacity>
        )}

        <Image
          source={require("../../assets/logo.png")}
          style={screenStyles.headerLogo}
          resizeMode="contain"
        />

        <TouchableOpacity
          style={screenStyles.menuButton}
          onPress={onMenuPress}
          activeOpacity={0.7}
        >
          <MaterialIcons name="menu" size={24} color="#1F3A5F" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ScreenHeader;
