import React, { useState } from "react";
import { View, SafeAreaView, ScrollView, StyleSheet } from "react-native";
import { screenStyles } from "../constants/screenStyles";
import { Spacing } from "../constants/theme";
import ScreenHeader from "../components/ScreenHeader";
import BottomNavigation from "../navigation/BottomNavigation";
import BadgeCard from "../components/BadgeCard";
import RegionSelector from "../components/RegionSelector";

const BadgeListScreen = ({ setActiveTab }) => {
  const [selectedRegion, setSelectedRegion] = useState("대전광역시");

  const badges = [
    { id: 1, progress: 12, total: 12, title: "도장 깨기", subtitle: "클릭하여 완료하기", region: "대전 동구" },
    { id: 2, progress: 9, total: 12, title: "도장 깨기", subtitle: "10시간 내", region: "대전 동구" },
    { id: 3, progress: 8, total: 12, title: "도장 깨기", subtitle: "10시간 내", region: "대전 동구" },
    { id: 4, progress: 5, total: 12, title: "도장 깨기", subtitle: "10시간 내", region: "대전 동구" },
    { id: 5, progress: 4, total: 12, title: "도장 깨기", subtitle: "10시간 내", region: "대전 동구" },
    { id: 6, progress: 2, total: 12, title: "도장 깨기", subtitle: "10시간 내", region: "대전 동구" },
    { id: 7, progress: 3, total: 12, title: "도장 깨기", subtitle: "10시간 내", region: "대전 동구" },
    { id: 8, progress: 2, total: 12, title: "도장 깨기", subtitle: "10시간 내", region: "대전 동구" },
    { id: 9, progress: 1, total: 12, title: "도장 깨기", subtitle: "10시간 내", region: "대전 동구" },
    { id: 10, progress: 0, total: 12, title: "도장 깨기", subtitle: "10시간 내", region: "대전 동구" },
    { id: 11, progress: 0, total: 12, title: "도장 깨기", subtitle: "10시간 내", region: "대전 동구" },
    { id: 12, progress: 0, total: 12, title: "도장 깨기", subtitle: "10시간 내", region: "대전 동구" },
  ];

  return (
    <SafeAreaView style={screenStyles.container}>
      <ScreenHeader 
        showBackButton={true}
        onBackPress={() => setActiveTab("travel")}
      />

      <ScrollView
        style={screenStyles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <RegionSelector 
          region={selectedRegion}
          onPress={() => {/* TODO: Open region picker */}}
        />

        <View style={styles.badgeGrid}>
          {badges.map((badge) => (
            <BadgeCard 
              key={badge.id} 
              badge={badge}
              onPress={() => {/* TODO: Navigate to badge detail */}}
              onMenuPress={() => {/* TODO: Open menu */}}
            />
          ))}
        </View>
      </ScrollView>

      <BottomNavigation activeTab="travel" setActiveTab={setActiveTab} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  badgeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
});

export default BadgeListScreen;
