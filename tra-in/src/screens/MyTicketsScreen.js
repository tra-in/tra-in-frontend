import React from "react";
import {
  Text,
  View,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { screenStyles, contentStyles } from "../constants/screenStyles";
import { Colors, Spacing } from "../constants/theme";
import ScreenHeader from "../components/ScreenHeader";
import BottomNavigation from "../navigation/BottomNavigation";

const MyTicketsScreen = ({ setActiveTab, setActiveScreen }) => {
  const handleTabChange = (newTab) => {
    if (setActiveScreen) {
      setActiveScreen(null);
    }
    setActiveTab(newTab);
  };

  return (
    <SafeAreaView style={screenStyles.container}>
      <ScrollView
        style={screenStyles.content}
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader />

        <View style={screenStyles.body}>
          <TouchableOpacity 
            style={styles.card} 
            activeOpacity={0.8}
            onPress={() => {
              if (setActiveScreen) {
                setActiveScreen(null);
              }
              setActiveTab("reservationList");
            }}
          >
            <Text style={styles.cardTitle}>예약 목록</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.card} 
            activeOpacity={0.8}
            onPress={() => {
              if (setActiveScreen) {
                setActiveScreen(null);
              }
              setActiveTab("badgeList");
            }}
          >
            <Text style={styles.cardTitle}>뱃지 목록</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <BottomNavigation activeTab="profile" setActiveTab={handleTabChange} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 30,
    height: 180,
    marginBottom: Spacing.md,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F4F4F4",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  cardTitle: {
    fontFamily: "Overpass",
    fontSize: 30,
    fontWeight: "600",
    color: Colors.black,
    textAlign: "center",
  },
});

export default MyTicketsScreen;