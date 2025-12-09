import React from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Colors, Typography, Spacing } from "../constants/theme";
import TicketBookingCard from "../components/TicketBookingCard";
import BottomNavigation from "../navigation/BottomNavigation";

const HomeScreen = ({ setActiveTab }) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>트레:in(人)</Text>
          <TouchableOpacity style={styles.menuButton}>
            <Text style={styles.menuText}>☰</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.body}>
          <TicketBookingCard />
        </View>
      </ScrollView>

      <BottomNavigation activeTab="home" setActiveTab={setActiveTab} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  content: {
    flex: 1,
  },
  header: {
    backgroundColor: Colors.korailBlue,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    height: 69,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    ...Typography.title,
    color: Colors.white,
    textAlign: "center",
  },
  menuButton: {
    position: "absolute",
    right: Spacing.md,
    padding: Spacing.sm,
  },
  menuText: {
    fontSize: 24,
    color: Colors.white,
  },
  body: {
    paddingHorizontal: 17,
    paddingTop: Spacing.md,
  },
});

export default HomeScreen;
