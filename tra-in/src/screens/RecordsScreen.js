import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Colors, Typography, Spacing } from "../constants/theme";
import BottomNavigation from "../navigation/BottomNavigation";

const RecordsScreen = ({ setActiveTab }) => {
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
          <Text style={styles.screenTitle}>기록</Text>
          <Text style={styles.screenDescription}>
            여행 기록이 여기 표시됩니다
          </Text>
        </View>
      </ScrollView>

      <BottomNavigation activeTab="records" setActiveTab={setActiveTab} />
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
    paddingTop: Spacing.lg,
  },
  screenTitle: {
    ...Typography.title,
    color: Colors.korailBlue,
    marginBottom: Spacing.md,
  },
  screenDescription: {
    ...Typography.body.medium,
    color: Colors.korailGray,
  },
});

export default RecordsScreen;
