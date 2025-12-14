import React from "react";
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { screenStyles } from "../constants/screenStyles";
import { Colors, Spacing } from "../constants/theme";
import ReservationCard from "../components/ReservationCard";
import BadgeCard from "../components/BadgeCard";
import { dummyReservations as DUMMY_RESERVATIONS } from "../data/dummyReservations";
import { generateDummyBadges } from "../data/dummyBadges";
import ScreenHeader from "../components/ScreenHeader";
import BottomNavigation from "../navigation/BottomNavigation";

const DUMMY_BADGES = generateDummyBadges();

const MyTicketsScreen = ({
  setActiveTab,
  setActiveScreen,
  setSelectedReservation,
  setSelectedBadge,
}) => {
  const handleTabChange = (newTab) => {
    if (setActiveScreen) setActiveScreen(null);
    setActiveTab(newTab);
  };

  return (
    <SafeAreaView style={screenStyles.container} edges={[]}>
      <ScreenHeader />

      <ScrollView
        style={screenStyles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <View style={screenStyles.body}>
          {/* Profile header */}
          <View style={styles.profileHeader}>
            <View style={styles.avatar} />
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>홍길동</Text>
              <Text style={styles.profilePoint}>포인트 1,200</Text>
            </View>
          </View>

          {/* Quick action buttons */}
          <View style={styles.quickActionsRow}>
            <TouchableOpacity
              style={styles.quickAction}
              activeOpacity={0.8}
              onPress={() => {
                if (setActiveScreen) setActiveScreen(null);
                setActiveTab("reservationList");
              }}
            >
              <Text style={styles.quickActionText}>예약</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickAction}
              activeOpacity={0.8}
              onPress={() => {
                if (setActiveScreen) setActiveScreen(null);
                setActiveTab("badgeList");
              }}
            >
              <Text style={styles.quickActionText}>뱃지</Text>
            </TouchableOpacity>
          </View>

          {/* Recent reservations */}
          <View style={styles.sectionHeaderRow}>
            <TouchableOpacity
              style={styles.sectionHeaderTouchable}
              activeOpacity={0.7}
              onPress={() => {
                if (setActiveTab) setActiveTab("reservationList");
                if (setActiveScreen) setActiveScreen(null);
              }}
            >
              <Text style={[styles.sectionTitle, styles.sectionTitleNoMargin]}>
                최근 예약
              </Text>
              <Text style={styles.sectionActionIcon}>›</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: 4, paddingRight: 12 }}
          >
            {DUMMY_RESERVATIONS.slice(0, 4).map((r) => (
              <View key={r.id} style={styles.recentResWrapper}>
                <ReservationCard
                  reservation={r}
                  compact
                  onPress={() => {
                    if (setSelectedReservation) setSelectedReservation(r);
                    if (setActiveScreen) setActiveScreen("reservationDetail");
                  }}
                />
              </View>
            ))}
          </ScrollView>

          {/* Completed badges */}
          <View style={styles.sectionHeaderRow}>
            <TouchableOpacity
              style={styles.sectionHeaderTouchable}
              activeOpacity={0.7}
              onPress={() => {
                if (setActiveTab) setActiveTab("badgeList");
                if (setActiveScreen) setActiveScreen(null);
              }}
            >
              <Text style={[styles.sectionTitle, styles.sectionTitleNoMargin]}>
                완료된 뱃지
              </Text>
              <Text style={styles.sectionActionIcon}>›</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: 8, paddingRight: 12 }}
          >
            {DUMMY_BADGES.filter((b) => b.status === "completed")
              .slice(0, 6)
              .map((b) => (
                <View key={b.id} style={styles.badgeItemWrapper}>
                  <BadgeCard
                    badge={b}
                    compact
                    onPress={() => {
                      if (setSelectedBadge) setSelectedBadge(b);
                      if (setActiveScreen) setActiveScreen("badgeDetail");
                    }}
                  />
                </View>
              ))}
          </ScrollView>

          {/* Not completed badges */}
          <View style={styles.sectionHeaderRow}>
            <TouchableOpacity
              style={styles.sectionHeaderTouchable}
              activeOpacity={0.7}
              onPress={() => {
                if (setActiveTab) setActiveTab("badgeList");
                if (setActiveScreen) setActiveScreen(null);
              }}
            >
              <Text style={[styles.sectionTitle, styles.sectionTitleNoMargin]}>
                미완료 뱃지
              </Text>
              <Text style={styles.sectionActionIcon}>›</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: 8, paddingRight: 12 }}
          >
            {DUMMY_BADGES.filter((b) => b.status !== "completed")
              .slice(0, 12)
              .map((b) => (
                <View key={b.id} style={styles.badgeItemWrapper}>
                  <BadgeCard
                    badge={b}
                    compact
                    onPress={() => {
                      if (setSelectedBadge) setSelectedBadge(b);
                      if (setActiveScreen) setActiveScreen("badgeDetail");
                    }}
                  />
                </View>
              ))}
          </ScrollView>
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
    shadowOffset: { width: 0, height: 4 },
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
  profileHeader: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#E6EEF8",
    marginRight: 14,
  },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 20, fontWeight: "700", color: Colors.black },
  profilePoint: { marginTop: 6, color: "#4B5563" },
  quickActionsRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  quickAction: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 18,
    paddingVertical: 18,
    marginHorizontal: 6,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  quickActionText: { fontSize: 16, fontWeight: "700", color: Colors.black },
  sectionHeaderRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 8,
  },
  sectionActionIcon: {
    fontSize: 28,
    color: Colors.black,
    lineHeight: 28,
    marginLeft: 8,
  },
  sectionTitleNoMargin: { marginBottom: 0 },
  sectionHeaderTouchable: { flexDirection: "row", alignItems: "center" },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.black,
    marginBottom: 8,
  },
  recentResWrapper: { width: 260, marginRight: 12 },
  badgeItemWrapper: { width: 172, marginRight: 12 },
});

export default MyTicketsScreen;
