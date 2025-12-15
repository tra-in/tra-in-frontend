import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  ActivityIndicator,
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
import { API_BASE } from "../config/api";

// 더미 유지
const places1 = [
  { name: "한밭수목원", region: "대전광역시 서구", image: IMAGES.places1_1 },
  {
    name: "장태산자연휴양림",
    region: "대전광역시 서구",
    image: IMAGES.places1_2,
  },
  { name: "대전 오월드", region: "대전광역시 중구", image: IMAGES.places1_3 },
  { name: "뿌리공원", region: "대전광역시 중구", image: IMAGES.places1_4 },
  { name: "유림공원", region: "대전광역시 유성구", image: IMAGES.places1_5 },
];

const places2 = [
  { name: "이태리국시", region: "대전광역시 서구", image: IMAGES.places2_1 },
  {
    name: "백송 대전유성점",
    region: "대전광역시 유성구",
    image: IMAGES.places2_2,
  },
  { name: "정식당", region: "대전광역시 유성구", image: IMAGES.places2_3 },
  { name: "성심당 본점", region: "대전광역시 중구", image: IMAGES.places2_4 },
  { name: "리코타코", region: "대전광역시 유성구", image: IMAGES.places2_5 },
];

const avatar = AVATAR.AVATAR;

function formatKoreanDate(isoDateTimeStr) {
  if (!isoDateTimeStr) return "";
  const d = new Date(isoDateTimeStr);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const day = ["일", "월", "화", "수", "목", "금", "토"][d.getDay()];
  return `${yyyy}.${mm}.${dd} (${day})`;
}

const TravelScreen = ({
  setActiveTab,
  setActiveScreen,
  setSelectedSegment,
}) => {
  const { width: windowWidth } = useWindowDimensions();
  const baseWidth = 375;
  const scale = windowWidth / baseWidth;

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // ✅ 메인에 보여줄 최신 여행 1건만 저장
  const [trip, setTrip] = useState({
    from: "",
    via: "",
    to: "",
    dateLabel: "",
    routeLabel: "",
    hasStopover: false,
  });

  // 모달 상태
  const [stopoverModalVisible, setStopoverModalVisible] = useState(false);
  const [selectedLeg, setSelectedLeg] = useState("LEG1");

  // ✅ 최신 1건 API 호출 → 바로 trip 세팅
  useEffect(() => {
    const fetchLatestTrip = async () => {
      try {
        setLoading(true);
        setErrorMsg("");

        const userId = 1;
        const res = await fetch(
          `${API_BASE}/user-tickets/latest-main?userId=${userId}`
        );

        if (res.status === 204) {
          // 예매 없음
          setTrip({
            from: "",
            via: "",
            to: "",
            dateLabel: "",
            routeLabel: "",
            hasStopover: false,
          });
          return;
        }

        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(`최신 예매 조회 실패 (${res.status}) ${text}`);
        }

        const data = await res.json();

        // ✅ 여기! data -> trip 변환 로직 들어가는 자리
        const legs = data?.legs ?? [];
        if (legs.length === 0) {
          setTrip({
            from: "",
            via: "",
            to: "",
            dateLabel: "",
            routeLabel: "",
            hasStopover: false,
          });
          return;
        }

        const from = legs[0].originStation;
        const to = legs[legs.length - 1].destStation;
        const dateLabel = formatKoreanDate(legs[0].departureTime);

        // 메인 화면 표시는 “출발-도착”만 (너 요구사항)
        const routeLabel = `${from} - ${to}`;

        // 모달 띄울지 판단은 legs 길이로!
        const hasStopover = legs.length >= 2;

        // 경유지는 모달에서 구간 표시할 때만 필요
        const via = hasStopover ? legs[0].destStation : "";

        setTrip({ from, via, to, dateLabel, routeLabel, hasStopover });
      } catch (e) {
        setErrorMsg(e?.message ?? "최신 예매를 불러오지 못했어요.");
        setTrip({
          from: "",
          via: "",
          to: "",
          dateLabel: "",
          routeLabel: "",
          hasStopover: false,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchLatestTrip();
  }, []);

  const handleAiPress = () => {
    if (!trip.from || !trip.to) return;

    if (trip.hasStopover) {
      setStopoverModalVisible(true);
      return;
    }

    setSelectedSegment?.(`${trip.from} - ${trip.to}`);
    setActiveScreen?.("aiRecommendDetail");
  };

  const handleConfirmLeg = (legKey) => {
    setStopoverModalVisible(false);

    const segment =
      legKey === "LEG1"
        ? `${trip.from} - ${trip.via}`
        : `${trip.via} - ${trip.to}`;

    setSelectedSegment?.(segment);
    setActiveScreen?.("aiRecommendDetail");
  };

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
        {loading ? (
          <View style={{ paddingTop: 40, alignItems: "center" }}>
            <ActivityIndicator />
            <Text style={{ marginTop: 10, color: Colors.korailGray }}>
              예매 내역 불러오는 중...
            </Text>
          </View>
        ) : errorMsg ? (
          <View style={{ paddingTop: 40, alignItems: "center" }}>
            <Text
              style={{
                color: "crimson",
                paddingHorizontal: 24,
                textAlign: "center",
              }}
            >
              {errorMsg}
            </Text>
          </View>
        ) : !trip.from ? (
          <View style={{ paddingTop: 40, alignItems: "center" }}>
            <Text style={{ color: Colors.korailGray }}>
              아직 예매 내역이 없어요.
            </Text>
          </View>
        ) : (
          <>
            <View style={[styles.planCardWrapper, { width: windowWidth }]}>
              <TravelPlanCard
                userName="홍길동"
                title={`${trip.to} 여행을 계획하고 있나요?`}
                avatar={avatar}
                route={trip.routeLabel}
                date={trip.dateLabel}
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

            {/* 아래 섹션들은 더미 유지 */}
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
                  여행 가서 뭐 먹지? {trip.to} 맛집 추천
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
          </>
        )}
      </ScrollView>

      <StopoverSelectModal
        visible={stopoverModalVisible}
        scale={scale}
        trip={{ from: trip.from, via: trip.via, to: trip.to }}
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
