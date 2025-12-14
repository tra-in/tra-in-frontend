import React, { useState } from "react";
import {
  Text,
  View,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  useWindowDimensions,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { screenStyles } from "../constants/screenStyles";
import { Colors, Spacing, BorderRadius } from "../constants/theme";
import ScreenHeader from "../components/ScreenHeader";
import BottomNavigation from "../navigation/BottomNavigation";
import PlaceCard from "../components/PlaceCard";
import TravelPlanCard from "../components/TravelPlanCard";
import StopoverSelectModal from "../components/StopoverSelectModal";

// Figma image assets (replace with actual URLs or local assets as needed)
const places1 = [
  {
    name: "한밭수목원",
    region: "대전광역시 서구",
    image:
      "http://10.0.2.2:3845/assets/236627a69d8aff909c691add6983739798d08da3.png",
  },
  {
    name: "장태산자연휴양림",
    region: "대전광역시 서구",
    image:
      "http://10.0.2.2:3845/assets/262a57cf60324787cdeea484abf80bc4bef8bce8.png",
  },
  {
    name: "대전 오월드",
    region: "대전광역시 중구",
    image:
      "http://10.0.2.2:3845/assets/6b745c76fe40dfd69d01701854f932e9139ffe97.png",
  },
  {
    name: "뿌리공원",
    region: "대전광역시 중구",
    image:
      "http://10.0.2.2:3845/assets/e29dcb4fa345ef1a617a571a7b479f37af48b618.png",
  },
  {
    name: "유림공원",
    region: "대전광역시 유성구",
    image:
      "http://10.0.2.2:3845/assets/6ce7eec86f1aba3846efd7c6cb5fb5fb1cecb7c7.png",
  },
];

const places2 = [
  {
    name: "이태리국시",
    region: "대전광역시 서구",
    image:
      "http://10.0.2.2:3845/assets/815bee86a89a2b22f2aed200fab7fcbb59a1bbc0.png",
  },
  {
    name: "백송 대전유성점",
    region: "대전광역시 유성구",
    image:
      "http://10.0.2.2:3845/assets/b7875e63382b16246a27a76f5d68e490392c958a.png",
  },
  {
    name: "정식당",
    region: "대전광역시 유성구",
    image:
      "http://10.0.2.2:3845/assets/e2592603fdff2ff183ed7b26644c3aefe6ab8312.png",
  },
  {
    name: "성심당 본점",
    region: "대전광역시 중구",
    image:
      "http://10.0.2.2:3845/assets/f8d0eceda0a10884c7a7c574b4df3bbb443a87fd.png",
  },
  {
    name: "리코타코",
    region: "대전광역시 유성구",
    image:
      "http://10.0.2.2:3845/assets/50b27a2998332c3bc81fa87ec30fe220b6b56709.png",
  },
];

const avatar =
  "http://10.0.2.2:3845/assets/1b5860a0f6bb3a218b4940d0f285a1ed9260ca16.png";

const TravelScreen = ({
  setActiveTab,
  setActiveScreen,
  setSelectedSegment,
}) => {
  const { width: windowWidth } = useWindowDimensions();
  // 기준 디자인이 375px(iPhone 13 mini)라면, 비율로 환산
  const baseWidth = 375;
  const scale = windowWidth / baseWidth;

  // 더미 데이터
  const trip = { from: "부산", via: "김천구미", to: "대전" };
  const hasStopover = Boolean(trip.via);

  // 모달 상태
  const [stopoverModalVisible, setStopoverModalVisible] = useState(false);
  const [selectedLeg, setSelectedLeg] = useState("LEG1"); // 기본 선택

  // AI 추천 일정 버튼 클릭
  const handleAiPress = () => {
    if (hasStopover) {
      setStopoverModalVisible(true);
      return;
    }
    // 경유지 없으면 바로 추천 진행(지금은 더미)
    console.log("추천 진행:", `${trip.from}-${trip.to}`);
  };

  // 모달에서 확인 클릭
  const handleConfirmLeg = (legKey) => {
    console.log("CONFIRM LEG:", legKey);
    console.log("setActiveScreen is function?", typeof setActiveScreen);

    setStopoverModalVisible(false);

    const segment =
      legKey === "LEG1"
        ? `${trip.from} - ${trip.via}`
        : `${trip.via} - ${trip.to}`;
    setSelectedSegment?.(segment);

    console.log("GO AI DETAIL NOW");

    // 실제 네비게이션: 새 화면으로 이동
    if (setActiveScreen) {
      setActiveScreen("aiRecommendDetail");
    }
    // const segment = legKey === "LEG1" ? `${trip.from}-${trip.via}` : `${trip.via}-${trip.to}`;
    // console.log("선택 구간:", legKey, segment);
  };

  // 카드/섹션 등 주요 요소의 가로 크기 동적 계산
  const cardWidth = Math.round(332 * scale);
  const cardHeight = Math.round(188 * scale);
  const avatarSize = Math.round(56 * scale);
  const placeCardWidth = Math.round(154 * scale);
  const placeImageHeight = Math.round(159 * scale);

  return (
    <SafeAreaView style={screenStyles.container}>
      <ScrollView
        style={screenStyles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {/* 헤더 */}
        <ScreenHeader title="트레:in(人)" />

        {/* 여행 계획 카드 */}
        <View style={[styles.planCardWrapper, { width: windowWidth }]}>
          <TravelPlanCard
            userName="홍길동"
            title="대전 여행을 계획하고 있나요?"
            avatar={avatar}
            route="부산 - 대전"
            date="2025.12.15 (월)"
            scale={scale}
            cardWidth={cardWidth}
            cardHeight={cardHeight}
            avatarSize={avatarSize}
            onAiPress={handleAiPress}
          />
          <Text
            style={[
              styles.selectOtherTrip,
              { marginRight: 24 * scale, fontSize: 10 * scale },
            ]}
          >
            다른 여행 선택
          </Text>
        </View>

        {/* 많은 트레인이 만족한 명소 */}
        <View
          style={[
            styles.sectionWrap,
            { paddingHorizontal: 0, width: windowWidth },
          ]}
        >
          <View
            style={[
              styles.sectionHeader,
              { paddingRight: 15 * scale, paddingLeft: 24 * scale },
            ]}
          >
            <Text style={[styles.sectionTitle, { fontSize: 18 * scale }]}>
              많은 트레인이 만족한 명소
            </Text>
            <TouchableOpacity>
              <MaterialIcons
                name="chevron-right"
                size={24 * scale}
                color={Colors.korailGray}
                style={{ marginLeft: 4 * scale }}
              />
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingLeft: 16 * scale,
              paddingRight: 16 * scale,
            }}
            snapToInterval={placeCardWidth + 8 * scale}
            decelerationRate="fast"
          >
            {places1.map((place, idx) => (
              <PlaceCard
                key={idx}
                place={place}
                width={placeCardWidth}
                imageHeight={placeImageHeight}
                scale={scale}
              />
            ))}
          </ScrollView>
        </View>

        {/* 오늘은 뭐 먹지? 대전 맛집 추천 */}
        <View
          style={[
            styles.sectionWrap,
            { paddingHorizontal: 0, width: windowWidth },
          ]}
        >
          <View
            style={[
              styles.sectionHeader,
              { paddingRight: 15 * scale, paddingLeft: 24 * scale },
            ]}
          >
            <Text style={[styles.sectionTitle, { fontSize: 18 * scale }]}>
              여행 가서 뭐 먹지? 대전 맛집 추천
            </Text>
            <TouchableOpacity>
              <MaterialIcons
                name="chevron-right"
                size={24 * scale}
                color={Colors.korailGray}
                style={{ marginLeft: 4 * scale }}
              />
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingLeft: 16 * scale,
              paddingRight: 16 * scale,
            }}
            snapToInterval={placeCardWidth + 8 * scale}
            decelerationRate="fast"
          >
            {places2.map((place, idx) => (
              <PlaceCard
                key={idx}
                place={place}
                width={placeCardWidth}
                imageHeight={placeImageHeight}
                scale={scale}
              />
            ))}
          </ScrollView>
        </View>
      </ScrollView>
      <StopoverSelectModal
        visible={stopoverModalVisible}
        scale={scale}
        trip={trip}
        selectedLeg={selectedLeg}
        setSelectedLeg={setSelectedLeg}
        onClose={() => setStopoverModalVisible(false)}
        onConfirm={() => handleConfirmLeg(selectedLeg)}
      />

      <BottomNavigation activeTab="travel" setActiveTab={setActiveTab} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  planCardWrapper: {
    marginTop: 24,
    marginBottom: 24, // 아래 섹션과 간격을 넉넉히
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 16, // 좌우 여백 추가
  },
  planCard: {
    backgroundColor: Colors.white,
    borderRadius: 30,
    width: 332,
    height: 188,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    paddingHorizontal: 20, // 좌우 패딩 증가
    paddingTop: 18,
    paddingBottom: 18,
    flexDirection: "column",
    alignItems: "flex-start",
    position: "relative",
  },
  planCardTextWrap: {
    width: "100%",
    marginBottom: 7,
    paddingLeft: 3,
  },
  greeting: {
    fontSize: 13,
    color: Colors.korailGray,
    marginBottom: 2,
    fontWeight: "400",
  },
  planTitle: {
    fontSize: 20,
    color: Colors.black,
    fontWeight: "bold",
    textAlign: "left",
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    position: "absolute",
    left: 25,
    top: 96,
    borderWidth: 1,
    borderColor: Colors.korailSilver,
    backgroundColor: Colors.white,
  },
  planInfoWrap: {
    position: "absolute",
    left: 94,
    top: 88, // 더 위로 올림
    width: 216,
    // height: 60, // 높이 고정 제거
    justifyContent: "flex-start",
    alignItems: "flex-start",
    backgroundColor: "transparent",
    // gap: 2, // gap 제거
  },
  planDate: {
    fontSize: 13,
    color: Colors.korailGray,
    textAlign: "center",
    marginBottom: 2,
    fontWeight: "400",
  },
  planRoute: {
    fontSize: 15,
    color: Colors.black,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 6,
  },
  aiButton: {
    backgroundColor: "#fbe8efff",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    marginTop: 4,
    // marginBottom은 인라인에서 조정
  },
  aiButtonText: {
    color: "#FF81B9",
    fontSize: 12,
    fontWeight: "bold",
  },
  selectOtherTrip: {
    color: Colors.korailGray,
    fontSize: 10,
    marginTop: 6,
    alignSelf: "flex-end",
    marginRight: 24,
    fontWeight: "400",
  },
  sectionWrap: {
    marginTop: 0, // 카드와 맞추기 위해 위쪽 마진 제거
    marginBottom: 24, // 아래쪽 넉넉히
    paddingHorizontal: 16, // 카드와 동일한 좌우 패딩
    width: "100%",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
    paddingRight: 8,
    paddingLeft: 2,
  },
  sectionTitle: {
    fontSize: 18,
    color: Colors.black,
    fontWeight: "600",
    letterSpacing: -0.5,
  },
  chevron: {
    fontSize: 20,
    color: Colors.korailGray,
    marginLeft: 4,
    fontWeight: "600",
  },
  placeCard: {
    width: 154,
    marginRight: 8,
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 6,
    alignItems: "flex-start",
    // shadow 제거 (피그마와 동일하게)
    shadowColor: undefined,
    shadowOffset: undefined,
    shadowOpacity: undefined,
    shadowRadius: undefined,
    elevation: 0,
  },
  placeImage: {
    width: 154,
    height: 159,
    borderRadius: 12,
    marginBottom: 3,
    backgroundColor: Colors.korailSilver,
  },
  placeName: {
    fontSize: 15,
    color: Colors.black,
    fontWeight: "600",
    marginBottom: 1,
    marginLeft: 2,
  },
  placeRegion: {
    fontSize: 12,
    color: Colors.korailGray,
    marginLeft: 2,
  },
});

export default TravelScreen;
