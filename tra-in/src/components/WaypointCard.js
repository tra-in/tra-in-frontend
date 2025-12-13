import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Colors } from "../constants/theme";
import WaypointActionButton from "./WaypointActionButton";

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
}) {
  return (
    <View style={styles.card}>
      <View
        style={[
          styles.marker,
          { backgroundColor: typeColor[type] || Colors.korailGray },
        ]}
      >
        <Text style={styles.markerText}>{number}</Text>
      </View>

      {showDivider && <View style={styles.divider} />}

      <View style={styles.infoWrap}>
        <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
          {title}
        </Text>

        <Text style={styles.desc} numberOfLines={1} ellipsizeMode="tail">
          {desc}
        </Text>
      </View>

      <WaypointActionButton onPress={onDirectionsPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderColor: Colors.korailSilver,
    borderWidth: 1,
    borderRadius: 10,
    height: 55,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
    position: "relative",
    paddingRight: 8,
  },
  marker: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 17,
    marginRight: 10,
  },
  divider: {
    width: 1,
    height: 32,
    backgroundColor: Colors.korailSilver,
    marginRight: 10,
  },
  markerText: {
    color: Colors.white,
    fontWeight: "bold",
    fontSize: 12,
  },

  // ✅ Android에서 말줄임 안정화
  infoWrap: {
    flex: 1,
    minWidth: 0, // 중요: flex 아이템 안 Text가 ellipsis 되려면 필요할 때가 많음
    justifyContent: "center",
    marginRight: 8,
  },

  // ✅ 한 줄 + 말줄임
  title: {
    fontSize: 15,
    fontWeight: "600",
    color: "#2d2d2d",
    flexShrink: 1,
  },
  desc: {
    fontSize: 12,
    color: Colors.korailGray,
    fontWeight: "500",
    marginTop: 2,
    flexShrink: 1,
  },
});
