import React from "react";
import {
  Text,
  View,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { screenStyles } from "../constants/screenStyles";
import { Colors, Typography, Spacing, BorderRadius } from "../constants/theme";
import ScreenHeader from "../components/ScreenHeader";
import BottomNavigation from "../navigation/BottomNavigation";

const TravelScreen = ({ setActiveTab }) => {
  return (
    <SafeAreaView style={screenStyles.container}>
      <ScrollView
        style={screenStyles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <ScreenHeader />

        <View style={screenStyles.body}>
          {/* 여행 경로 추천 카드 */}
          <TouchableOpacity style={styles.card} activeOpacity={0.8}>
            <Text style={styles.cardTitle}>여행 경로 추천</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <BottomNavigation activeTab="travel" setActiveTab={setActiveTab} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: Spacing.lg,
  },
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

export default TravelScreen;
