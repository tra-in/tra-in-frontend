import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Colors } from "../constants/theme";
import WaypointActionButton from "./WaypointActionButton";
import { MaterialIcons } from "@expo/vector-icons";

const typeColor = {
  기차역: Colors.korailBlue,
  "맛집/카페": Colors.korailHotPink,
  관광: Colors.korailGold,
};

export default function WaypointCard({
  number,
  title,
  desc,
  type,
  showDivider,
  onDirectionsPress,

  // ✅ 추가
  isPinned = false,
  onTogglePin = () => {},
  showPin = true, // 기차역은 false로 줄 예정
}) {
  const markerBg = typeColor[type] || Colors.white;

  return (
    <View style={styles.row}>
      <View style={styles.card}>
        {/* ✅ 왼쪽: 하트(고정) */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onTogglePin}
          disabled={!showPin}
          style={[
            styles.marker,
            { backgroundColor: markerBg, opacity: showPin ? 1 : 0.9 },
          ]}
        >
          {showPin ? (
            <MaterialIcons
              name={isPinned ? "favorite" : "favorite-border"}
              size={16}
              color={Colors.korailHotPink}
            />
          ) : (
            <MaterialIcons name="train" size={16} color={Colors.white} />
          )}
        </TouchableOpacity>

        {showDivider && <View style={styles.divider} />}

        <View style={styles.infoWrap}>
          <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
            {title}
          </Text>
          <Text style={styles.desc} numberOfLines={1} ellipsizeMode="tail">
            {desc}
          </Text>
        </View>

        <View style={styles.actionWrap}>
          <WaypointActionButton onPress={onDirectionsPress} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  card: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderColor: Colors.korailSilver,
    borderWidth: 1,
    borderRadius: 10,
    height: 55,
    paddingRight: 10,
  },
  marker: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 14,
    marginRight: 10,
  },
  divider: {
    width: 1,
    height: 32,
    backgroundColor: Colors.korailSilver,
    marginRight: 10,
  },
  infoWrap: {
    flex: 1,
    justifyContent: "center",
    marginRight: 10,
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    color: "#2d2d2d",
  },
  desc: {
    fontSize: 12,
    color: Colors.korailGray,
    fontWeight: "500",
    marginTop: 2,
  },
  actionWrap: {
    justifyContent: "center",
    alignItems: "flex-end",
  },
});
