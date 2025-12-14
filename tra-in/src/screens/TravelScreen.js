import React, { useState } from "react";
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { screenStyles } from "../constants/screenStyles";
import { Colors } from "../constants/theme";
import { IMAGES, AVATAR } from "../constants/images";
import ScreenHeader from "../components/ScreenHeader";
import BottomNavigation from "../navigation/BottomNavigation";
import PlaceCard from "../components/PlaceCard";
import TravelPlanCard from "../components/TravelPlanCard";
import StopoverSelectModal from "../components/StopoverSelectModal";

// Figma image assets
const places1 = [
  {
    name: "한밭수목원",
    region: "대전광역시 서구",
    image: IMAGES.places1_1,
  },
  {
    name: "장태산자연휴양림",
    region: "대전광역시 서구",
    image: IMAGES.places1_2,
  },
  {
    name: "대전 오월드",
    region: "대전광역시 중구",
    image: IMAGES.places1_3,
  },
  {
    name: "뿌리공원",
    region: "대전광역시 중구",
    image: IMAGES.places1_4,
  },
  {
    name: "유림공원",
    region: "대전광역시 유성구",
    image: IMAGES.places1_5,
  },
];

const places2 = [
  {
    name: "이태리국시",
    region: "대전광역시 서구",
    image: IMAGES.places2_1,
  },
  {
    name: "백송 대전유성점",
    region: "대전광역시 유성구",
    image: IMAGES.places2_2,
  },
  {
    name: "정식당",
    region: "대전광역시 유성구",
    image: IMAGES.places2_3,
  },
  {
    name: "성심당 본점",
    region: "대전광역시 중구",
    image: IMAGES.places2_4,
  },
  {
    name: "리코타코",
    region: "대전광역시 유성구",
    image: IMAGES.places2_5,
  },
];

const avatar = AVATAR.AVATAR;

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
  const [selectedLeg, setSelectedLeg] = useState("LEG1");

  // AI 추천 일정 버튼 클릭
  const handleAiPress = () => {
    if (hasStopover) {
      setStopoverModalVisible(true);
      return;
    }
    console.log("추천 진행:", `${trip.from}-${trip.to}`);
  };

  // 모달에서 확인 클릭
  const handleConfirmLeg = (legKey) => {
    console.log("CONFIRM LEG:", legKey);
    setStopoverModalVisible(false);

    const segment =
      legKey === "LEG1"
        ? `${trip.from} - ${trip.via}`
        : `${trip.via} - ${trip.to}`;

    setSelectedSegment?.(segment);

    if (setActiveScreen) {
      setActiveScreen("aiRecommendDetail");
    }
  };

  // 카드/섹션 등 주요 요소의 가로 크기 동적 계산
  const cardWidth = Math.round(332 * scale);
  const cardHeight = Math.round(188 * scale);
  const avatarSize = Math.round(56 * scale);
  const placeCardWidth = Math.round(154 * scale);
  const placeImageHeight = Math.round(159 * scale);

  return (
    <SafeAreaView style={screenStyles.container} edges={[]}>
      <ScreenHeader />

      <ScrollView
        style={screenStyles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
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

      {/* 모달 */}
      <StopoverSelectModal
        visible={stopoverModalVisible}
        scale={scale}
        trip={trip}
        selectedLeg={selectedLeg}
        setSelectedLeg={setSelectedLeg}
        onClose={() => setStopoverModalVisible(false)}
        onConfirm={() => handleConfirmLeg(selectedLeg)}
      />

      {/* 하단 탭 */}
      <BottomNavigation activeTab="travel" setActiveTab={setActiveTab} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  planCardWrapper: {
    marginTop: 24,
    marginBottom: 24,
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 16,
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
    marginTop: 0,
    marginBottom: 24,
    paddingHorizontal: 16,
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
});

export default TravelScreen;
