import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal } from "react-native";
import { Colors, Spacing, BorderRadius } from "../constants/theme";

/**
 * 뱃지 완료시 축하 팝업 모달
 * @param {string} region - 완료된 지역명
 * @param {function} onClose - 닫기 핸들러
 */
const CongratulationModal = ({ region, onClose }) => {
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
          
          {/* 완료 이미지 영역 - 빵 일러스트 (TODO: 실제 이미지로 교체) */}
          <View style={styles.imagePlaceholder}>
            <Text style={styles.imageText}>🍞</Text>
          </View>
          
          <Text style={styles.congratsText}>축하드립니다!</Text>
          <Text style={styles.subText}>다 머겄슈~!</Text>
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
    height: 218,
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
    marginTop: 5,
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
  },
});

export default CongratulationModal;
