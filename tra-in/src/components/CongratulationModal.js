
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal, Image } from "react-native";
import { Colors, Spacing, BorderRadius } from "../constants/theme";
import { REGION_INFO } from "../constants/badgeConstants";

/**
 * 뱃지 완료시 축하 팝업 모달
 * @param {string} region - 완료된 지역명
 * @param {function} onClose - 닫기 핸들러
 */
const CONGRATS_DATA = {
  "대전 중구": {
    image: require("../../assets/daejeon_joonggu.png"),
    sub: "다 머겄슈~!",
  },
  "강원 춘천시": {
    image: require("../../assets/gangwon_chooncheon.png"),
    sub: "다 묵었드래요~!",
  },
  "부산 수영구": {
    image: require("../../assets/busan_sooyeonggu.png"),
    sub: "다 묵어뿟다~!",
  },
};

const CongratulationModal = ({ region, onClose }) => {
  const info = CONGRATS_DATA[region] || {};
  const regionInfo = REGION_INFO[region];
  return (
    <Modal
      transparent={true}
      visible={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.overlay} 
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.region}>{region}</Text>
          {/* 지역별 이미지 */}
          {info.image ? (
            <Image source={info.image} style={styles.imagePlaceholder} resizeMode="contain" />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.imageText}>🎉</Text>
            </View>
          )}
          <Text style={styles.congratsText}>{info.message || "축하드립니다!"}</Text>
          <Text style={styles.subText}>{info.sub || "여행을 모두 완료했어요!"}</Text>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: 333,
    height: 230,
    backgroundColor: Colors.white,
    borderRadius: 44,
    paddingVertical: 15,
    paddingHorizontal: 47,
    alignItems: "center",
    justifyContent: "space-between",
  },
  region: {
    fontSize: 12,
    color: "#888",
    fontFamily: "System",
    textAlign: "center",
  },
  imagePlaceholder: {
    width: 120,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  imageText: {
    fontSize: 60,
  },
  congratsText: {
    fontSize: 22,
    fontWeight: "700",
    color: "#000",
    fontFamily: "System",
    textAlign: "center",
  },
  subText: {
    fontSize: 14,
    color: Colors.black,
    fontFamily: "System",
    textAlign: "center",
    marginBottom: 10,
  },
});

export default CongratulationModal;
