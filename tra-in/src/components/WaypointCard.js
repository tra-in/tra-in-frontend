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

  isEditing = false,
  onRemove,
}) {
  return (
    <View style={styles.row}>
      {isEditing && (
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onRemove}
          style={styles.removeBtn}
        >
          <MaterialIcons name="remove" size={18} color={Colors.white} />
        </TouchableOpacity>
      )}

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

        <View style={styles.actionWrap}>
          {!isEditing && <WaypointActionButton onPress={onDirectionsPress} />}
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
  removeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#FF5A6A",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
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
  markerText: {
    color: Colors.white,
    fontWeight: "bold",
    fontSize: 12,
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
