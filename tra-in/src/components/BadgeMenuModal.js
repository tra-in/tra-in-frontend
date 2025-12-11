import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal } from "react-native";
import { Colors, Spacing, BorderRadius } from "../constants/theme";

/**
 * 뱃지 메뉴 팝업 컴포넌트
 * @param {boolean} visible - 모달 표시 여부
 * @param {object} position - 버튼 위치 { x, y, width, height }
 * @param {function} onEdit - 수정 핸들러
 * @param {function} onDelete - 삭제 핸들러
 * @param {function} onClose - 모달 닫기 핸들러
 */
const BadgeMenuModal = ({ visible, position, onEdit, onDelete, onClose }) => {
  /**
   * 수정 버튼 클릭
   */
  const handleEdit = () => {
    onEdit();
    onClose();
  };

  /**
   * 삭제 버튼 클릭
   */
  const handleDelete = () => {
    onDelete();
    onClose();
  };

  if (!visible || !position) return null;

  // 메뉴 위치 계산 (버튼 바로 아래 오른쪽 정렬)
  const menuStyle = {
    position: 'absolute',
    top: position.y + position.height + 4,
    left: position.x + position.width - 140, // 메뉴 너비(140px) 기준 오른쪽 정렬
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={[styles.menuContainer, menuStyle]}>
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={handleEdit}
            activeOpacity={0.7}
          >
            <Text style={styles.menuText}>뱃지 수정</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={handleDelete}
            activeOpacity={0.7}
          >
            <Text style={[styles.menuText, styles.deleteText]}>뱃지 삭제</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "transparent",
  },
  menuContainer: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    minWidth: 140,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  menuItem: {
    paddingVertical: 14,
    paddingHorizontal: 18,
  },
  menuText: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.black,
    fontFamily: "System",
  },
  deleteText: {
    color: "#FF4444",
  },
  divider: {
    height: 1,
    backgroundColor: "#E8E8E8",
  },
});

export default BadgeMenuModal;
