import React, { useState } from "react";
import { View, Text, Modal, TouchableOpacity, ScrollView, StyleSheet, Image } from "react-native";
import { Colors, Spacing, BorderRadius } from "../constants/theme";

/**
 * 장소 상세 정보 모달
 * @param {boolean} visible - 모달 표시 여부
 * @param {object} place - 장소 데이터
 * @param {function} onClose - 모달 닫기 핸들러
 * @param {function} onVisitToggle - 방문 토글 핸들러
 */
const PlaceDetailModal = ({ visible, place, onClose, onVisitToggle }) => {
  const [showBusinessHours, setShowBusinessHours] = useState(false);

  if (!place) return null;

  /**
   * 영업시간 토글
   */
  const toggleBusinessHours = () => {
    setShowBusinessHours(!showBusinessHours);
  };

  /**
   * 방문/미방문 버튼 클릭
   */
  const handleVisitToggle = () => {
    if (onVisitToggle) {
      onVisitToggle(place);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity 
          style={styles.overlayTouchable} 
          activeOpacity={1}
          onPress={onClose}
        />
        <View style={styles.modalContainer}>
          {/* 모션바 */}
          <View style={styles.motionBar} />

          <ScrollView 
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            <View style={styles.contentContainer}>
              {/* 이미지 그리드 */}
              <View style={styles.imageGrid}>
                {/* 큰 이미지 */}
                <View style={styles.mainImageContainer}>
                  <Image 
                    source={{ uri: place.images?.[0] || 'https://via.placeholder.com/133x167' }}
                    style={styles.mainImage}
                  />
                </View>

                {/* 작은 이미지들 */}
                <View style={styles.smallImagesContainer}>
                  {[1, 2, 3, 4].map((index) => (
                    <View key={index} style={styles.smallImageWrapper}>
                      {index === 4 ? (
                        // 더보기 버튼
                        <View style={styles.moreImagesOverlay}>
                          <Image 
                            source={{ uri: place.images?.[index] || 'https://via.placeholder.com/85x81' }}
                            style={styles.smallImage}
                          />
                          <View style={styles.moreImagesTextContainer}>
                            <Text style={styles.moreImagesText}>더보기</Text>
                          </View>
                        </View>
                      ) : (
                        <Image 
                          source={{ uri: place.images?.[index] || 'https://via.placeholder.com/85x81' }}
                          style={styles.smallImage}
                        />
                      )}
                    </View>
                  ))}
                </View>
              </View>

              {/* 구분선 */}
              <View style={styles.divider} />

              {/* 가게 정보 */}
              <View style={styles.infoSection}>
                <View style={styles.titleRow}>
                  <Text style={styles.placeName}>{place.name}</Text>
                  <Text style={styles.placeType}>{place.type}</Text>
                </View>

                {/* 방문/미방문 버튼 */}
                <TouchableOpacity 
                  style={[
                    styles.visitButton,
                    place.visited && styles.visitButtonActive
                  ]}
                  onPress={handleVisitToggle}
                >
                  <Text style={[
                    styles.visitButtonText,
                    place.visited && styles.visitButtonTextActive
                  ]}>
                    {place.visited ? "방문" : "미방문"}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* 구분선 */}
              <View style={styles.divider} />

              {/* 주소 */}
              <View style={styles.addressSection}>
                <Text style={styles.addressText}>{place.address?.new || "주소 정보 없음"}</Text>
                <Text style={styles.addressTextOld}>{place.address?.old || ""}</Text>
              </View>

              {/* 구분선 */}
              <View style={styles.divider} />

              {/* 영업시간 */}
              <TouchableOpacity 
                style={styles.businessHoursSection}
                onPress={toggleBusinessHours}
              >
                <View style={styles.businessHoursHeader}>
                  <View style={styles.clockIcon} />
                  <Text style={styles.businessStatusText}>영업 중</Text>
                  <Text style={styles.businessTimeText}>21:30 까지</Text>
                </View>
                <View style={styles.chevronIcon}>
                  <Text style={styles.chevronText}>
                    {showBusinessHours ? "∧" : "∨"}
                  </Text>
                </View>
              </TouchableOpacity>

              {/* 영업시간 상세 (토글) */}
              {showBusinessHours && (
                <View style={styles.businessHoursDetail}>
                  {place.weeklyHours?.map((day, index) => (
                    <View key={index} style={styles.dayRow}>
                      <Text style={styles.dayText}>{day.day}</Text>
                      <View style={styles.timeColumn}>
                        <Text style={styles.timeText}>{day.hours}</Text>
                        {day.lastOrder && (
                          <Text style={styles.lastOrderText}>{day.lastOrder}</Text>
                        )}
                      </View>
                    </View>
                  ))}
                </View>
              )}

              {/* 구분선 */}
              <View style={styles.divider} />

              {/* 전화번호 */}
              <View style={styles.phoneSection}>
                <View style={styles.phoneIcon} />
                <Text style={styles.phoneText}>{place.phone || "전화번호 정보 없음"}</Text>
              </View>

              {/* 구분선 */}
              <View style={styles.divider} />
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  overlayTouchable: {
    flex: 1,
  },
  modalContainer: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "85%",
  },
  motionBar: {
    width: 65,
    height: 4,
    backgroundColor: "#D9D9D9",
    alignSelf: "center",
    marginTop: 13,
    borderRadius: 2,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  
  // 이미지 그리드
  imageGrid: {
    flexDirection: "row",
    marginTop: 8,
    marginBottom: 8,
    gap: 6,
  },
  mainImageContainer: {
    width: 133,
    height: 167,
    borderRadius: 12,
    overflow: "hidden",
  },
  mainImage: {
    width: "100%",
    height: "100%",
  },
  smallImagesContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  smallImageWrapper: {
    width: 85,
    height: 81,
    borderRadius: 12,
    overflow: "hidden",
  },
  smallImage: {
    width: "100%",
    height: "100%",
  },
  moreImagesOverlay: {
    position: "relative",
    width: "100%",
    height: "100%",
  },
  moreImagesTextContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  moreImagesText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: "500",
  },
  
  // 구분선
  divider: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 10,
  },
  
  // 가게 정보
  infoSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 10,
  },
  titleRow: {
    flex: 1,
  },
  placeName: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.black,
    marginBottom: 4,
  },
  placeType: {
    fontSize: 12,
    color: Colors.gray,
  },
  visitButton: {
    width: 51,
    height: 51,
    borderRadius: 25.5,
    backgroundColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
  },
  visitButtonActive: {
    backgroundColor: Colors.korailBlue,
  },
  visitButtonText: {
    fontSize: 14,
    color: Colors.gray,
    fontWeight: "500",
  },
  visitButtonTextActive: {
    color: Colors.white,
  },
  
  // 주소
  addressSection: {
    paddingHorizontal: 10,
  },
  addressText: {
    fontSize: 13,
    color: Colors.black,
    marginBottom: 4,
  },
  addressTextOld: {
    fontSize: 13,
    color: Colors.gray,
  },
  
  // 영업시간
  businessHoursSection: {
    paddingHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  businessHoursHeader: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  clockIcon: {
    width: 17,
    height: 17,
    borderRadius: 8.5,
    backgroundColor: "#D9D9D9",
    marginRight: 8,
  },
  businessStatusText: {
    fontSize: 12,
    color: Colors.black,
    marginRight: 8,
  },
  businessTimeText: {
    fontSize: 14,
    color: Colors.black,
    fontWeight: "500",
  },
  chevronIcon: {
    width: 17,
    height: 17,
    justifyContent: "center",
    alignItems: "center",
  },
  chevronText: {
    fontSize: 12,
    color: Colors.gray,
  },
  businessHoursDetail: {
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingLeft: 45,
  },
  dayRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  dayText: {
    fontSize: 14,
    color: Colors.black,
    width: 60,
  },
  timeColumn: {
    flex: 1,
  },
  timeText: {
    fontSize: 14,
    color: Colors.black,
    marginBottom: 2,
  },
  lastOrderText: {
    fontSize: 11,
    color: Colors.gray,
  },
  
  // 전화번호
  phoneSection: {
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  phoneIcon: {
    width: 17,
    height: 17,
    borderRadius: 8.5,
    backgroundColor: "#D9D9D9",
    marginRight: 8,
  },
  phoneText: {
    fontSize: 11,
    color: Colors.black,
  },
});

export default PlaceDetailModal;
