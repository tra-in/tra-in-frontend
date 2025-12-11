import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Colors, Spacing, BorderRadius } from "../constants/theme";
import CircularProgress from "./CircularProgress";

/**
 * 뱃지 카드 컴포넌트
 * @param {object} badge - 뱃지 데이터 객체
 * @param {function} onPress - 카드 클릭 핸들러 (선택)
 * @param {function} onMenuPress - 메뉴 버튼 클릭 핸들러 (선택)
 */
const BadgeCard = ({ badge, onPress, onMenuPress }) => {
  return (
    <TouchableOpacity 
      style={styles.card} 
      activeOpacity={0.8}
      onPress={onPress}
    >
      <TouchableOpacity 
        style={styles.menuButton}
        onPress={onMenuPress}
      >
        <Text style={styles.menuDots}>⋮</Text>
      </TouchableOpacity>
      
      <View style={styles.content}>
        <CircularProgress 
          progress={badge.progress} 
          total={badge.total} 
          color={badge.color} 
        />
        
        <Text style={styles.title}>{badge.title}</Text>
        <Text style={styles.subtitle}>{badge.subtitle}</Text>
        <Text style={styles.region}>{badge.region}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: "48%",
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: "relative",
    minHeight: 180,
  },
  menuButton: {
    position: "absolute",
    top: 8,
    right: 8,
    padding: 4,
    zIndex: 1,
  },
  menuDots: {
    fontSize: 20,
    color: Colors.korailGray,
    lineHeight: 20,
  },
  content: {
    alignItems: "center",
    paddingTop: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.black,
    marginBottom: 4,
    marginTop: 12,
    fontFamily: "System",
  },
  subtitle: {
    fontSize: 12,
    color: Colors.korailGray,
    marginBottom: 2,
    fontFamily: "System",
  },
  region: {
    fontSize: 12,
    color: Colors.korailGray,
    fontFamily: "System",
  },
});

export default BadgeCard;
