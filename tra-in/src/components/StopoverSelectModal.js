import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "../constants/theme";

export default function StopoverSelectModal({
  visible,
  onClose,
  onConfirm,
  trip,
  scale = 1,
  selectedLeg,
  setSelectedLeg,
}) {
  if (!trip?.via) return null; // 경유지 없으면 자체 렌더 X

  const option1 = `${trip.from} - ${trip.via}`;
  const option2 = `${trip.via} - ${trip.to}`;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View
          style={[
            styles.card,
            { borderRadius: 18 * scale, padding: 16 * scale },
          ]}
        >
          <View style={styles.headerRow}>
            <Text style={[styles.title, { fontSize: 15 * scale }]}>
              이번 여행에는 경유지가 있네요!
            </Text>
            <TouchableOpacity onPress={onClose} hitSlop={10}>
              <MaterialIcons
                name="close"
                size={22 * scale}
                color={Colors.korailGray}
              />
            </TouchableOpacity>
          </View>

          <Text
            style={[
              styles.desc,
              { fontSize: 12 * scale, marginTop: 6 * scale },
            ]}
          >
            일정 추천을 원하는 구간을 선택해주세요.
          </Text>

          <View style={{ marginTop: 12 * scale }}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => setSelectedLeg("LEG1")}
              style={[
                styles.option,
                {
                  borderRadius: 12 * scale,
                  paddingVertical: 10 * scale,
                  paddingHorizontal: 12 * scale,
                  marginBottom: 8 * scale,
                  borderColor:
                    selectedLeg === "LEG1" ? "#FF81B9" : Colors.korailSilver,
                  backgroundColor:
                    selectedLeg === "LEG1" ? "#FFE5EF" : Colors.white,
                },
              ]}
            >
              <Text
                style={[
                  styles.optionText,
                  {
                    fontSize: 13 * scale,
                    color: selectedLeg === "LEG1" ? "#FF81B9" : Colors.black,
                    fontWeight: selectedLeg === "LEG1" ? "700" : "600",
                  },
                ]}
              >
                {option1}
              </Text>
              {selectedLeg === "LEG1" && (
                <MaterialIcons
                  name="check-circle"
                  size={18 * scale}
                  color="#FF81B9"
                />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => setSelectedLeg("LEG2")}
              style={[
                styles.option,
                {
                  borderRadius: 12 * scale,
                  paddingVertical: 10 * scale,
                  paddingHorizontal: 12 * scale,
                  borderColor:
                    selectedLeg === "LEG2" ? "#FF81B9" : Colors.korailSilver,
                  backgroundColor:
                    selectedLeg === "LEG2" ? "#FFE5EF" : Colors.white,
                },
              ]}
            >
              <Text
                style={[
                  styles.optionText,
                  {
                    fontSize: 13 * scale,
                    color: selectedLeg === "LEG2" ? "#FF81B9" : Colors.black,
                    fontWeight: selectedLeg === "LEG2" ? "700" : "600",
                  },
                ]}
              >
                {option2}
              </Text>
              {selectedLeg === "LEG2" && (
                <MaterialIcons
                  name="check-circle"
                  size={18 * scale}
                  color="#FF81B9"
                />
              )}
            </TouchableOpacity>
          </View>

          <View style={[styles.buttonRow, { marginTop: 14 * scale }]}>
            <TouchableOpacity
              onPress={onClose}
              activeOpacity={0.9}
              style={[
                styles.secondaryBtn,
                { borderRadius: 10 * scale, paddingVertical: 10 * scale },
              ]}
            >
              <Text style={[styles.secondaryText, { fontSize: 13 * scale }]}>
                닫기
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onConfirm}
              activeOpacity={0.9}
              style={[
                styles.primaryBtn,
                { borderRadius: 10 * scale, paddingVertical: 10 * scale },
              ]}
            >
              <Text style={[styles.primaryText, { fontSize: 13 * scale }]}>
                이 구간으로 추천
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    paddingHorizontal: 18,
  },
  card: {
    backgroundColor: Colors.white,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: { color: Colors.black, fontWeight: "800" },
  desc: { color: Colors.korailGray, fontWeight: "500" },

  option: {
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  optionText: { letterSpacing: -0.2 },

  buttonRow: { flexDirection: "row" },
  secondaryBtn: {
    flex: 1,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.korailSilver,
    marginRight: 10,
  },
  secondaryText: {
    textAlign: "center",
    color: Colors.korailGray,
    fontWeight: "700",
  },

  primaryBtn: { flex: 1, backgroundColor: "#FFE5EF" },
  primaryText: { textAlign: "center", color: "#FF81B9", fontWeight: "800" },
});
