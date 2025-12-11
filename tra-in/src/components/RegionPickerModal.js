import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView } from "react-native";
import { Colors, Spacing, BorderRadius } from "../constants/theme";
import { REGION_LIST } from "../constants/badgeConstants";

/**
 * 지역 선택 모달 컴포넌트
 * @param {boolean} visible - 모달 표시 여부
 * @param {string} selectedRegion - 현재 선택된 지역
 * @param {function} onSelect - 지역 선택 핸들러
 * @param {function} onClose - 모달 닫기 핸들러
 */
const RegionPickerModal = ({ visible, selectedRegion, onSelect, onClose }) => {
  /**
   * 지역 선택 핸들러
   */
  const handleSelect = (region) => {
    onSelect(region);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>지역 선택</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            {REGION_LIST.map((region) => (
              <TouchableOpacity
                key={region}
                style={[
                  styles.regionItem,
                  selectedRegion === region && styles.selectedItem,
                ]}
                onPress={() => handleSelect(region)}
              >
                <Text
                  style={[
                    styles.regionText,
                    selectedRegion === region && styles.selectedText,
                  ]}
                >
                  {region}
                </Text>
                {selectedRegion === region && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
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
    padding: 20,
  },
  modalContainer: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    width: "100%",
    maxWidth: 400,
    maxHeight: "80%",
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.black,
    fontFamily: "System",
  },
  closeButton: {
    padding: 4,
  },
  closeText: {
    fontSize: 24,
    color: Colors.korailGray,
    lineHeight: 24,
  },
  scrollView: {
    maxHeight: 500,
  },
  regionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  selectedItem: {
    backgroundColor: "#F3F6FB",
  },
  regionText: {
    fontSize: 16,
    color: Colors.black,
    fontFamily: "System",
  },
  selectedText: {
    fontWeight: "700",
    color: Colors.korailBlue,
  },
  checkmark: {
    fontSize: 20,
    color: Colors.korailBlue,
    fontWeight: "700",
  },
});

export default RegionPickerModal;
