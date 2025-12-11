import React, { useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Colors, Spacing, BorderRadius } from "../constants/theme";
import CircularProgress from "./CircularProgress";
import { getDisplayRegionName, getDateRangeText } from "../constants/badgeConstants";

/**
 * 뱃지(여행) 카드 컴포넌트
 * @param {object} badge - 뱃지 데이터 객체
 * @param {function} onPress - 카드 클릭 핸들러 (선택)
 * @param {function} onMenuPress - 메뉴 버튼 클릭 핸들러 (선택) - (event) => void
 * @param {boolean} hideMenu - 메뉴 버튼 숨김 여부
 * @param {boolean} inline - 인라인 모드 (디테일 화면용)
 * @param {boolean} completed - 완료 상태 (체크마크 표시)
 */
const BadgeCard = ({ badge, onPress, onMenuPress, hideMenu = false, inline = false, completed = false }) => {
  const CardWrapper = onPress ? TouchableOpacity : View;
  const isCompleted = completed || (badge.progress === badge.total);
  const menuButtonRef = useRef(null);
  
  // 지역 표시 (여러 지역인 경우 "대전 동구 외 1곳" 형태)
  const displayRegion = getDisplayRegionName(badge.regions);
  
  // 날짜 범위 표시
  const dateRangeText = getDateRangeText(badge.startDate, badge.endDate);

  /**
   * 메뉴 버튼 클릭 핸들러
   */
  const handleMenuPress = () => {
    if (onMenuPress && menuButtonRef.current) {
      menuButtonRef.current.measure((x, y, width, height, pageX, pageY) => {
        onMenuPress({
          x: pageX,
          y: pageY,
          width,
          height,
        });
      });
    }
  };
  
  return (
    <CardWrapper 
      style={[styles.card, inline && styles.inlineCard]} 
      activeOpacity={onPress ? 0.8 : 1}
      onPress={onPress}
    >
      {!hideMenu && onMenuPress && (
        <TouchableOpacity 
          ref={menuButtonRef}
          style={styles.menuButton}
          onPress={handleMenuPress}
        >
          <Text style={styles.menuDots}>⋮</Text>
        </TouchableOpacity>
      )}
      
      <View style={styles.content}>
        <CircularProgress 
          progress={badge.progress} 
          total={badge.total} 
          color={badge.color}
          showCheckmark={isCompleted}
        />
        
        <Text style={styles.title}>{badge.title}</Text>
        <Text style={styles.subtitle}>{dateRangeText}</Text>
        <Text style={styles.region}>{displayRegion}</Text>
      </View>
    </CardWrapper>
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
  inlineCard: {
    width: "48%",
    alignSelf: "center",
    backgroundColor: Colors.white,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 15,
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
