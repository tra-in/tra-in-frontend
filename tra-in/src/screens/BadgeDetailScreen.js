import React from "react";
import { View, Text, SafeAreaView, ScrollView, StyleSheet } from "react-native";
import { screenStyles } from "../constants/screenStyles";
import { Colors, Spacing } from "../constants/theme";
import ScreenHeader from "../components/ScreenHeader";
import BottomNavigation from "../navigation/BottomNavigation";
import BadgeCard from "../components/BadgeCard";
import PlaceListItem from "../components/PlaceListItem";

/**
 * 뱃지(여행) 상세 화면 (미완료 상태)
 * 진행 중이거나 미시작 상태의 여행 정보 표시
 * @param {function} setActiveTab - 탭 변경 함수
 * @param {function} setActiveScreen - 화면 변경 함수
 * @param {function} setSelectedPlace - 선택된 장소 설정 함수
 * @param {object} badge - 뱃지(여행) 데이터
 */
const BadgeDetailScreen = ({ setActiveTab, setActiveScreen, setSelectedPlace, badge }) => {
  /**
   * 장소 정렬: 미방문 장소가 위로, 방문 완료한 장소는 아래로
   */
  const unvisitedPlaces = badge.places.filter(place => !place.visited);
  const visitedPlaces = badge.places.filter(place => place.visited);
  const sortedPlaces = [...unvisitedPlaces, ...visitedPlaces];

  /**
   * 뒤로가기 핸들러
   */
  const handleBackPress = () => {
    setActiveScreen(null);
    setActiveTab("badgeList");
  };

  /**
   * 장소 클릭 핸들러
   */
  const handlePlacePress = (place) => {
    setSelectedPlace(place);
    setActiveScreen("placeDetail");
  };

  return (
    <SafeAreaView style={screenStyles.container}>
      <ScreenHeader 
        showBackButton={true}
        onBackPress={handleBackPress}
      />

      <View style={styles.container}>
        {/* 그거 아세요? 정보 박스 */}
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>그거 아세요?</Text>
          <Text style={styles.infoText}>대전 동구 이사동의 500년 군묘는 유네스코 등재를 노리는 독특한 문화 유산이며, 소제동의 변화는 동구의 새로운 트렌디한 매력을 보여주는 비밀로 꼽힙니다.</Text>
        </View>

        {/* 뱃지 카드 재활용 */}
        <BadgeCard badge={badge} hideMenu={true} inline={true} />

        {/* 장소 목록 */}
        <ScrollView 
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {sortedPlaces.map((place, index) => (
            <PlaceListItem
              key={place.id}
              place={place}
              showStatus={true}
              onPress={() => handlePlacePress(place)}
            />
          ))}
        </ScrollView>
      </View>

      <BottomNavigation activeTab="travel" setActiveTab={setActiveTab} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
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
  scrollContainer: {
    flex: 1,
  },
});

export default BadgeDetailScreen;
