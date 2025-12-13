import React, { useState } from "react";
import { View, Text, SafeAreaView, ScrollView, StyleSheet, Image, TouchableOpacity } from "react-native";
import { screenStyles } from "../constants/screenStyles";
import { Colors, Spacing } from "../constants/theme";
import ScreenHeader from "../components/ScreenHeader";
import BottomNavigation from "../navigation/BottomNavigation";
import { PhoneIcon, MapPinIcon, ClockIcon, ChevronDownIcon, CheckIcon } from "../components/Icons";

/**
 * 장소 상세 화면
 * @param {function} setActiveTab - 탭 변경 함수
 * @param {function} setActiveScreen - 화면 변경 함수
 * @param {object} place - 장소 데이터
 * @param {function} onVisitToggle - 방문 토글 핸들러
 * 
 * 
 */
const PlaceDetailScreen = ({ setActiveTab, setActiveScreen, place, onVisitToggle, previousScreen}) => {
  const [showBusinessHours, setShowBusinessHours] = useState(false);

  if (!place) return null;

  /**
   * 뒤로가기 핸들러
   */
  const handleBackPress = () => {
    if (previousScreen) {
      setActiveScreen(previousScreen);
    } else {
      setActiveScreen(null);
    }
  };

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
    <SafeAreaView style={screenStyles.container}>
      <ScreenHeader 
        showBackButton={true}
        onBackPress={handleBackPress}
      />

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentContainer}>
          {/* 이미지 그리드 래퍼 */}
          <View style={styles.imageGridWrapper}>
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
            <MapPinIcon size={17} color="#77777A" />
            <View style={styles.addressTextContainer}>
              <Text style={styles.addressText}>{place.address?.new || "주소 정보 없음"}</Text>
              <Text style={styles.addressTextOld}>{place.address?.old || ""}</Text>
            </View>
          </View>

          {/* 구분선 */}
          <View style={styles.divider} />

          {/* 영업시간 */}
          <TouchableOpacity 
            style={styles.businessHoursSection}
            onPress={toggleBusinessHours}
            activeOpacity={0.7}
          >
            <View style={styles.businessHoursHeader}>
              <ClockIcon size={17} color="#77777A" />
              <Text style={styles.businessStatusText}>영업 중</Text>
              <Text style={styles.businessTimeText}>21:30 까지</Text>
            </View>
            <View style={[styles.chevronIcon, showBusinessHours && styles.chevronIconRotated]}>
              <ChevronDownIcon size={17} color="#77777A" />
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
            <PhoneIcon size={17} color="#77777A" />
            <Text style={styles.phoneText}>{place.phone || "전화번호 정보 없음"}</Text>
          </View>

          {/* 구분선 */}
          <View style={styles.divider} />
        </View>
      </ScrollView>

      <BottomNavigation 
        activeTab="travel" 
        setActiveTab={(tab) => {
          setActiveScreen(null);
          setActiveTab(tab);
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  
  // 이미지 그리드 래퍼
  imageGridWrapper: {
    width: "100%",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 8,
  },
  // 이미지 그리드
  imageGrid: {
    flexDirection: "row",
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
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    width: 176,
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
  },
  titleRow: {
    flex: 1,
  },
  placeName: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.black,
    marginBottom: 4,
  },
  placeType: {
    fontSize: 13,
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
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 2,
    gap: 8,
  },
  addressTextContainer: {
    flex: 1,
  },
  addressText: {
    fontSize: 14,
    color: Colors.black,
    marginBottom: 4,
  },
  addressTextOld: {
    fontSize: 12,
    color: Colors.gray,
  },
  
  // 영업시간
  businessHoursSection: {
    paddingHorizontal: 3,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  businessHoursHeader: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 8,
  },
  businessStatusText: {
    fontSize: 13,
    color: Colors.black,
  },
  businessTimeText: {
    fontSize: 13,
    color: Colors.black,
    fontWeight: "500",
  },
  chevronIcon: {
    width: 17,
    height: 17,
    justifyContent: "center",
    alignItems: "center",
    transform: [{ rotate: "0deg" }],
  },
  chevronIconRotated: {
    transform: [{ rotate: "180deg" }],
  },
  businessHoursDetail: {
    paddingHorizontal: 3,
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
    paddingHorizontal: 3,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  phoneText: {
    fontSize: 13,
    color: Colors.black,
  },
});

export default PlaceDetailScreen;
