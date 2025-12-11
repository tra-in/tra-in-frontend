import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Colors, Spacing } from "../constants/theme";

/**
 * 장소 아이템 컴포넌트
 * @param {object} place - 장소 데이터 객체 (Place 모델)
 * @param {function} onPress - 클릭 핸들러
 * @param {boolean} showDate - 방문 날짜 표시 여부 (완료 화면용)
 * @param {boolean} showStatus - 미방문 상태 표시 여부 (미완료 화면용)
 */
const PlaceListItem = ({ place, onPress, showDate = false, showStatus = false }) => {
  const { name, type, businessHours, closedDay, visitDate, imageUrl, images, visited } = place;
  const displayImage = imageUrl || (images && images.length > 0 ? images[0] : null);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* 이미지 */}
      <View style={styles.imageContainer}>
        {displayImage ? (
          <Image source={{ uri: displayImage }} style={styles.image} />
        ) : (
          <View style={[styles.image, styles.imagePlaceholder]} />
        )}
      </View>

      {/* 정보 영역 */}
      <View style={styles.infoContainer}>
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
        
        <Text style={styles.category}>{type}</Text>
        
        <Text style={styles.details} numberOfLines={2}>
          영업시간 {businessHours} {closedDay && `| 휴무일 ${closedDay}`}
        </Text>
      </View>

      {/* 오른쪽: 날짜 또는 미방문 상태 */}
      {showDate && visitDate && (
        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>{visitDate}</Text>
          <Text style={styles.completedText}>방문 완료</Text>
        </View>
      )}
      
      {showStatus && !visited && (
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>미방문</Text>
        </View>
      )}
      
      {showStatus && visited && visitDate && (
        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>{visitDate}</Text>
          <Text style={styles.completedText}>방문 완료</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 10,
    marginBottom: 8,
    minHeight: 90,
    alignItems: "center",
  },
  imageContainer: {
    width: 70,
    height: 70,
    borderRadius: 8,
    overflow: "hidden",
    marginRight: 12,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imagePlaceholder: {
    backgroundColor: "#F3F6FB",
  },
  infoContainer: {
    flex: 1,
    justifyContent: "center",
  },
  name: {
    fontSize: 15,
    fontWeight: "600",
    color: "#000",
    fontFamily: "System",
    marginBottom: 4,
  },
  category: {
    fontSize: 12,
    color: "#888",
    fontFamily: "System",
    marginBottom: 4,
  },
  details: {
    fontSize: 11,
    color: "#999",
    lineHeight: 14,
    fontFamily: "System",
  },
  dateContainer: {
    marginLeft: 10,
    alignItems: "flex-end",
  },
  dateText: {
    fontSize: 11,
    color: "#888",
    fontFamily: "System",
    lineHeight: 16,
  },
  completedText: {
    fontSize: 11,
    color: "#888",
    fontFamily: "System",
    lineHeight: 16,
  },
  statusContainer: {
    marginLeft: 10,
    backgroundColor: "#FFE5E5",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    color: "#FF6B6B",
    fontWeight: "600",
    fontFamily: "System",
  },
});

export default PlaceListItem;
