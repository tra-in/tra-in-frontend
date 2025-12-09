import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Colors, Typography, Spacing, BorderRadius } from "../constants/theme";
import { ArrowRightIcon } from "./Icons";

const TicketBookingCard = () => {
  const [ticketType, setTicketType] = useState("regular");
  const [tripType, setTripType] = useState("oneway");

  const Checkbox = ({ checked }) => (
    <View style={[styles.checkbox, checked && styles.checkboxChecked]} />
  );

  return (
    <View>
      {/* Ticket Type Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => setTicketType("regular")}
        >
          <Text
            style={[
              styles.tabText,
              ticketType === "regular" && styles.tabTextActive,
            ]}
          >
            승차권 예매
          </Text>
        </TouchableOpacity>
        <View style={styles.tabWithCheckbox}>
          <Checkbox checked={ticketType === "grasshopper"} />
          <TouchableOpacity
            style={styles.tab}
            onPress={() => setTicketType("grasshopper")}
          >
            <Text style={styles.tabTextInactive}>메뚜기 예매</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Main Booking Card */}
      <View style={styles.card}>
        {/* Trip Type Selection */}
        <View style={styles.tripTypeContainer}>
          <View style={styles.tripTypeOption}>
            <Checkbox checked={tripType === "oneway"} />
            <TouchableOpacity onPress={() => setTripType("oneway")}>
              <Text
                style={[
                  styles.tripTypeText,
                  tripType === "oneway" && styles.tripTypeTextActive,
                ]}
              >
                편도
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.tripTypeOption}>
            <Checkbox checked={tripType === "roundtrip"} />
            <TouchableOpacity onPress={() => setTripType("roundtrip")}>
              <Text
                style={[
                  styles.tripTypeText,
                  tripType === "roundtrip" && styles.tripTypeTextActive,
                ]}
              >
                왕복
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Route Selection */}
        <View style={styles.routeSection}>
          <View style={styles.routeLabels}>
            <Text style={styles.routeLabel}>출발</Text>
            <Text style={styles.routeLabel}>도착</Text>
          </View>
          <View style={styles.routeCities}>
            <Text style={styles.cityName}>부산</Text>
            <View style={styles.arrowContainer}>
              <ArrowRightIcon size={16} color={Colors.korailBlue} />
            </View>
            <Text style={styles.cityName}>대전</Text>
          </View>
        </View>

        {/* Date Selection */}
        <View style={styles.infoSection}>
          <Text style={styles.infoLabel}>가는 날</Text>
          <Text style={styles.infoValue}>2025년 12월 16일 (화)</Text>
        </View>

        {/* Passenger Selection */}
        <View style={styles.infoSection}>
          <Text style={styles.infoLabel}>인원 선택</Text>
          <Text style={styles.infoValue}>어른 1명</Text>
        </View>
      </View>

      {/* Search Button */}
      <TouchableOpacity style={styles.searchButton}>
        <Text style={styles.searchButtonText}>열차 조회</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: "row",
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  tab: {
    paddingVertical: Spacing.sm,
  },
  tabWithCheckbox: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  tabText: {
    ...Typography.body.medium,
    color: Colors.korailBlue,
  },
  tabTextActive: {
    fontWeight: "500",
  },
  tabTextInactive: {
    ...Typography.body.medium,
    color: Colors.korailSilver,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.korailSilver,
    marginBottom: Spacing.md,
  },
  card: {
    borderWidth: 1,
    borderColor: Colors.korailSilver,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    backgroundColor: Colors.white,
    gap: Spacing.md,
  },
  tripTypeContainer: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  tripTypeOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  tripTypeText: {
    ...Typography.body.small,
    color: Colors.korailSilver,
  },
  tripTypeTextActive: {
    color: Colors.korailGray,
  },
  checkbox: {
    width: 12,
    height: 12,
    borderWidth: 1,
    borderColor: Colors.korailSilver,
    borderRadius: 2,
    backgroundColor: Colors.white,
  },
  checkboxChecked: {
    backgroundColor: Colors.korailGray,
  },
  routeSection: {
    gap: Spacing.sm,
  },
  routeLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
  },
  routeLabel: {
    ...Typography.body.medium,
    color: Colors.korailSilver,
  },
  routeCities: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.sm,
  },
  cityName: {
    ...Typography.heading.large,
    color: Colors.korailBlue,
    flex: 1,
    textAlign: "center",
  },
  arrowContainer: {
    paddingHorizontal: Spacing.sm,
  },
  infoSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoLabel: {
    ...Typography.body.medium,
    color: Colors.korailLightBlue,
  },
  infoValue: {
    ...Typography.heading.medium,
    color: Colors.korailGray,
  },
  searchButton: {
    backgroundColor: Colors.korailLemon,
    borderWidth: 1,
    borderColor: Colors.korailSilver,
    borderTopWidth: 0,
    borderBottomLeftRadius: BorderRadius.lg,
    borderBottomRightRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -1,
  },
  searchButtonText: {
    ...Typography.heading.medium,
    color: Colors.korailLightBlue,
  },
});

export default TicketBookingCard;
