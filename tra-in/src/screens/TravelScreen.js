import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  ActivityIndicator,
  Alert,
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

// 더미 데이터 유지
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

export default function TravelScreen({
  setActiveTab,
  setActiveScreen,
  setSelectedSegment,
  setSearchParams,
  userId = 1,
}) {
  const { width: windowWidth } = useWindowDimensions();
  const baseWidth = 375;
  const scale = windowWidth / baseWidth;

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const [stopoverModalVisible, setStopoverModalVisible] = useState(false);
  const [selectedLeg, setSelectedLeg] = useState("LEG1");

  // ✅ ticketId 하나만 사용
  const [trip, setTrip] = useState({
    ticketId: null, // ✅ 백엔드 latest-main 응답의 ticketId(묶음 ticket_id)
    from: "",
    via: "",
    to: "",
    dateLabel: "",
    routeLabel: "",
    hasStopover: false,
  });

  useEffect(() => {
    const fetchLatestTrip = async () => {
      try {
        setLoading(true);
        setErrorMsg("");

        // ✅ 백엔드 컨트롤러 기준: @RequestMapping("/api") + @GetMapping("/user-tickets/latest-main")
        // => GET /api/user-tickets/latest-main?userId=1
        const res = await fetch(
          `${API_BASE}/user-tickets/latest-main?userId=${userId}`
        );

        if (res.status === 204) {
          setTrip({
            ticketId: null,
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
        console.log("[latest-main raw data]", data);

        const legs = data?.legs ?? [];
        if (legs.length === 0) {
          setTrip({
            ticketId: null,
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
        const routeLabel = `${from} - ${to}`;

        const hasStopover = legs.length >= 2;
        const via = hasStopover ? legs[0].destStation : "";

        // ✅ 이제 백엔드에서 dto.ticketId를 내려준다고 가정
        const extractedTicketId = data?.ticketId ?? null;
        console.log("[latest-main extractedTicketId]", extractedTicketId);

        setTrip({
          ticketId: extractedTicketId,
          from,
          via,
          to,
          dateLabel,
          routeLabel,
          hasStopover,
        });
      } catch (e) {
        setErrorMsg(e?.message ?? "최신 예매를 불러오지 못했어요.");
        setTrip({
          ticketId: null,
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
  }, [userId]);

  // ✅ AI 추천 버튼
  const handleAiPress = () => {
    if (!trip.from || !trip.to) return;

    if (!trip.ticketId) {
      console.log("[AI] ticketId missing:", trip);
      Alert.alert(
        "오류",
        "예매 ID(ticketId)를 가져오지 못했어요.\n(백엔드 latest-main 응답에 ticketId가 포함되어 있는지 확인해줘)"
      );
      return;
    }

    // 경유 있으면 모달
    if (trip.hasStopover) {
      setStopoverModalVisible(true);
      return;
    }

    // ✅ 직행
    setSearchParams?.({
      userId,
      ticketId: trip.ticketId,
      destName: trip.to,
      isHopper: false,
      // 아래는 디버깅/표시용으로 필요하면 같이 넘겨도 됨
      routeLabel: trip.routeLabel,
      dateLabel: trip.dateLabel,
      from: trip.from,
      to: trip.to,
      via: trip.via,
      hasStopover: trip.hasStopover,
    });

    setActiveScreen?.("preferenceSurvey");
    setActiveTab?.("travel");
  };

  // ✅ 경유: LEG1/LEG2에 따라 destName만 다르게, ticketId는 동일
  const handleConfirmLeg = (legKey) => {
    if (!trip.ticketId) {
      console.log("[AI] ticketId missing:", trip);
      Alert.alert("오류", "ticketId가 없습니다.");
      return;
    }

    setStopoverModalVisible(false);

    const dest = legKey === "LEG1" ? trip.via : trip.to;

    const segment =
      legKey === "LEG1"
        ? `${trip.from} - ${trip.via}`
        : `${trip.via} - ${trip.to}`;
    setSelectedSegment?.(segment);

    setSearchParams?.({
      userId,
      ticketId: trip.ticketId, // ✅ 항상 동일
      destName: dest, // ✅ LEG에 따라 달라짐
      isHopper: true,
      segment,
      routeLabel: trip.routeLabel,
      dateLabel: trip.dateLabel,
      from: trip.from,
      to: trip.to,
      via: trip.via,
      hasStopover: trip.hasStopover,
    });

    setActiveScreen?.("preferenceSurvey");
    setActiveTab?.("travel");
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

            {/* 명소 */}
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

            {/* 맛집 */}
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

      {/* 경유 구간 선택 모달 */}
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
}

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
