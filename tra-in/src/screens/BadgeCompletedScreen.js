import React, { useState } from "react";
import { View, Text, SafeAreaView, ScrollView, StyleSheet } from "react-native";
import { screenStyles } from "../constants/screenStyles";
import { Colors, Spacing } from "../constants/theme";
import ScreenHeader from "../components/ScreenHeader";
import BottomNavigation from "../navigation/BottomNavigation";
import BadgeCard from "../components/BadgeCard";
import PlaceListItem from "../components/PlaceListItem";
import CongratulationModal from "../components/CongratulationModal";
import { REGION_INFO, getDisplayRegionName } from "../constants/badgeConstants";

/**
 * 뱃지(여행) 완료 화면
 * 모든 장소를 방문 완료한 여행 정보 표시
 * @param {function} setActiveTab - 탭 변경 함수
 * @param {function} setActiveScreen - 화면 변경 함수
 * @param {function} setSelectedPlace - 선택된 장소 설정 함수
 * @param {object} badge - 완료된 뱃지(여행) 데이터
 */
const BadgeCompletedScreen = ({ setActiveTab, setActiveScreen, setSelectedPlace, badge }) => {
  const [showModal, setShowModal] = useState(true);

  /**
   * 지역 정보 가져오기
   * 여러 지역인 경우 첫 번째 지역의 정보 표시
   */
  const regionInfo = REGION_INFO[badge.regions[0]] || "이 지역에 대한 흥미로운 이야기를 준비 중입니다!";

  /**
   * 뒤로가기 핸들러
   */
  const handleBackPress = () => {
    setActiveScreen(null);
    setActiveTab("badgeList");
  };

  return (
    <SafeAreaView style={screenStyles.container}>
      <ScreenHeader 
        showBackButton={true}
        onBackPress={handleBackPress}
      />

      <ScrollView
        style={screenStyles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 그거 아세요? */}
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>그거 아세요?</Text>
          <Text style={styles.infoText}>{regionInfo}</Text>
        </View>

        {/* 뱃지 카드 재활용 - 완료 상태 */}
        <BadgeCard badge={badge} hideMenu={true} inline={true} completed={true} />

        {/* 완료된 장소 목록 */}
        <View style={styles.placeListContainer}>
          {badge.places.map((place) => (
            <PlaceListItem
              key={place.id}
              place={place}
              showDate={true}
              onPress={() => {
                setSelectedPlace(place);
                setActiveScreen("placeDetail");
              }}
            />
          ))}
        </View>
      </ScrollView>

      <BottomNavigation activeTab="travel" setActiveTab={setActiveTab} />

      {/* 축하 팝업 - 여러 지역인 경우 대표 지역명 표시 */}
      {showModal && (
        <CongratulationModal
          region={getDisplayRegionName(badge.regions)}
          onClose={() => setShowModal(false)}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 30,
  },
  infoBox: {
    backgroundColor: "#F5E6D3",
    padding: 12,
    borderRadius: 12,
    marginBottom: 15,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#000",
    marginBottom: 8,
    fontFamily: "System",
    textAlign: "center",
  },
  infoText: {
    fontSize: 12,
    color: "#333",
    lineHeight: 18,
    fontFamily: "System",
    textAlign: "center",
  },
  placeListContainer: {
    marginTop: 5,
  },
});

export default BadgeCompletedScreen;
