import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Alert } from "react-native";
import React, { useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import HomeScreen from "./src/screens/HomeScreen";
import TravelScreen from "./src/screens/TravelScreen";
import RecordsScreen from "./src/screens/RecordsScreen";
import MyTicketsScreen from "./src/screens/MyTicketsScreen";
import ReservationListScreen from "./src/screens/ReservationListScreen";
import BadgeListScreen from "./src/screens/BadgeListScreen";
import BadgeDetailScreen from "./src/screens/BadgeDetailScreen";
import BadgeCompletedScreen from "./src/screens/BadgeCompletedScreen";
import PlaceDetailScreen from "./src/screens/PlaceDetailScreen";
import ReservationDetailScreen from "./src/screens/ReservationDetailScreen";
import CameraChatScreen from "./src/screens/CameraChatScreen";
import BookingScreen from "./src/screens/BookingScreen";
import LoginScreen from "./src/screens/LoginScreen";
import PreferenceSurveyScreen from "./src/screens/PreferenceSurveyScreen";
import LoadingScreen from "./src/screens/LoadingScreen"; // ✅ 추가
import { API_BASE } from "./src/config/api"; // ✅ 추가

const RECOMMENDER_API_BASE = "http://10.0.2.2:8000";
const DEFAULT_BASE = { latitude: 36.3258, longitude: 127.4353 };

export default function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("home");
  const [searchParams, setSearchParams] = useState(null);
  const [activeScreen, setActiveScreen] = useState(null);

  const [selectedSegment, setSelectedSegment] = useState(null);
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [previousScreen, setPreviousScreen] = useState(null);
  const [badgeFilter, setBadgeFilter] = useState(null);

  const handleSetActiveTab = (tab, options) => {
    if (tab === "badgeList" && options?.filter) setBadgeFilter(options.filter);
    else if (tab !== "badgeList") setBadgeFilter(null);
    setActiveTab(tab);
  };

  // ✅ 선호도(한글) → API용 영문
  const normalizePreference = (travelPreferenceKorean) => {
    const map = {
      힐링: "relaxation",
      액티비티: "activity",
      맛집: "food",
      쇼핑: "shopping",
      자연: "nature",
      문화: "culture",
    };
    const lowered = String(travelPreferenceKorean || "").toLowerCase();
    const englishSet = new Set([
      "relaxation",
      "activity",
      "food",
      "shopping",
      "nature",
      "culture",
    ]);
    if (englishSet.has(lowered)) return lowered;
    return map[travelPreferenceKorean] || "nature";
  };

  // ✅ 로딩 화면을 띄운 상태에서 추천을 미리 받아두고 AiRecommendDetail로 이동
  const openAiRecommendWithLoading = async (nextParams) => {
    // 1) params 먼저 저장 + Loading 화면 전환
    setSearchParams(nextParams);
    setActiveScreen("loading");

    try {
      const userId = nextParams?.userId;
      const ticketId = nextParams?.ticketId;
      const destName = nextParams?.destName;
      const travelPreferenceKorean = nextParams?.travelPreference ?? "자연";
      const travelPreferenceForApi = normalizePreference(
        travelPreferenceKorean
      );

      if (!userId || !ticketId) {
        throw new Error("userId/ticketId가 없습니다.");
      }

      // (선택) excluded 불러오기
      let excludedIds = [];
      try {
        const res = await fetch(
          `${API_BASE}/user-picks/excluded?userId=${userId}&userTicketId=${ticketId}`
        );
        if (res.ok) {
          const json = await res.json();
          excludedIds = json?.excludedContentIds ?? [];
        }
      } catch {}

      // 추천 요청
      const query =
        travelPreferenceKorean && destName
          ? `${destName}에서 ${travelPreferenceKorean} 중심으로 갈만한 곳 추천`
          : "가까운 여행지 추천";

      const body = {
        latitude: DEFAULT_BASE.latitude,
        longitude: DEFAULT_BASE.longitude,
        query,
        travel_preference: travelPreferenceForApi,
        content_types: ["12", "39", "25"],
        max_distance_km: 10,
        n_results: 30,
        distance_weight: 0.4,
        similarity_weight: 0.4,
        preference_weight: 0.2,
        exclude_content_ids: excludedIds,
      };

      const recRes = await fetch(
        `${RECOMMENDER_API_BASE}/api/v1/travel/search/location-hybrid`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      if (!recRes.ok) {
        const text = await recRes.text().catch(() => "");
        throw new Error(`추천 API 호출 실패 (${recRes.status}) ${text}`);
      }

      const recJson = await recRes.json();
      const results = recJson?.results ?? [];

      // 10개로 정리
      const mapped = results
        .filter((r) => r?.id)
        .filter((r) => !excludedIds.includes(r.id))
        .slice(0, 10)
        .map((r, idx) => ({
          number: idx + 2,
          type: r.content_type_name || "추천",
          title: r.title || "추천 장소",
          desc: `${r.content_type_name || "추천"} | ${
            r.address || "주소 정보 없음"
          }`,
          contentId: r.id,
          address: r.address,
          latitude: r.latitude,
          longitude: r.longitude,
          distanceKm: r.distance_km,
          imageUrl: r.image_url,
          phone: r.phone,
          contentTypeName: r.content_type_name,
        }));

      // ✅ AiRecommendDetailScreen이 바로 쓰도록 searchParams에 결과를 넣어둠
      setSearchParams((prev) => ({
        ...(prev || {}),
        ...nextParams,
        preloadedWaypoints: mapped,
      }));

      // 2) 로딩 → 상세로 전환
      setActiveScreen("aiRecommendDetail");
    } catch (e) {
      Alert.alert("오류", e?.message ?? "추천을 불러오지 못했어요.", [
        { text: "OK", onPress: () => setActiveScreen(null) },
      ]);
    }
  };

  const renderScreen = () => {
    // ✅ 로딩 화면
    if (activeScreen === "loading") {
      return <LoadingScreen />;
    }

    // 예약 상세 화면
    if (activeScreen === "reservationDetail" && selectedReservation) {
      return (
        <ReservationDetailScreen
          setActiveTab={handleSetActiveTab}
          setActiveScreen={setActiveScreen}
          reservation={selectedReservation}
          setSearchParams={setSearchParams}
          // ✅ 구간 버튼에서 이 함수 호출하면 "로딩 → 추천 → 상세" 흐름 완성
          openAiRecommendWithLoading={openAiRecommendWithLoading}
        />
      );
    }

    // 장소 상세 화면
    if (activeScreen === "placeDetail" && selectedPlace) {
      return (
        <PlaceDetailScreen
          activeTab={activeTab}
          setActiveTab={handleSetActiveTab}
          setActiveScreen={setActiveScreen}
          place={selectedPlace}
          previousScreen={previousScreen}
        />
      );
    }

    // 카메라 채팅 화면
    if (activeScreen === "cameraChat") {
      return (
        <CameraChatScreen
          activeTab={activeTab}
          setActiveTab={handleSetActiveTab}
          setActiveScreen={setActiveScreen}
        />
      );
    }

    // 뱃지 상세 화면
    if (activeScreen === "badgeDetail" && selectedBadge) {
      return (
        <BadgeDetailScreen
          activeTab={activeTab}
          setActiveTab={handleSetActiveTab}
          setActiveScreen={setActiveScreen}
          setSelectedPlace={setSelectedPlace}
          badge={selectedBadge}
          setPreviousScreen={setPreviousScreen}
        />
      );
    }

    if (activeScreen === "badgeCompleted" && selectedBadge) {
      return (
        <BadgeCompletedScreen
          activeTab={activeTab}
          setActiveTab={handleSetActiveTab}
          setActiveScreen={setActiveScreen}
          setSelectedPlace={setSelectedPlace}
          badge={selectedBadge}
          setPreviousScreen={setPreviousScreen}
        />
      );
    }

    // 선호도 조사 화면
    if (activeScreen === "preferenceSurvey") {
      return (
        <PreferenceSurveyScreen
          setActiveTab={handleSetActiveTab}
          setActiveScreen={setActiveScreen}
          searchParams={searchParams}
          setSearchParams={setSearchParams}
          setUserPreference={() => {}}
          openTravelFlow={({ region }) => {
            setSelectedSegment(region);
            setActiveScreen("aiRecommendDetail");
          }}
        />
      );
    }

    // AI 추천 상세 화면
    if (activeScreen === "aiRecommendDetail") {
      const AiRecommendDetailScreen =
        require("./src/screens/AiRecommendDetailScreen").default;

      const fallbackSegment =
        searchParams?.segment ||
        searchParams?.routeLabel ||
        selectedSegment ||
        "부산 - 대전";

      return (
        <AiRecommendDetailScreen
          setActiveTab={handleSetActiveTab}
          setActiveScreen={setActiveScreen}
          segment={fallbackSegment}
          searchParams={searchParams}
          setSearchParams={setSearchParams}
        />
      );
    }

    // 기본 탭 화면
    switch (activeTab) {
      case "home":
        return (
          <HomeScreen
            setActiveTab={handleSetActiveTab}
            searchParams={searchParams}
            setSearchParams={setSearchParams}
            user={user}
          />
        );

      case "booking":
        return (
          <BookingScreen
            setActiveTab={handleSetActiveTab}
            searchParams={searchParams}
            user={user}
          />
        );

      case "travel":
        return (
          <TravelScreen
            setActiveTab={handleSetActiveTab}
            setActiveScreen={setActiveScreen}
            setSelectedSegment={setSelectedSegment}
            setSearchParams={setSearchParams}
            userId={user?.id ?? 1}
          />
        );

      case "reservationList":
        return (
          <ReservationListScreen
            setActiveTab={handleSetActiveTab}
            setActiveScreen={setActiveScreen}
            setSelectedReservation={setSelectedReservation}
          />
        );

      case "badgeList":
        return (
          <BadgeListScreen
            setActiveTab={handleSetActiveTab}
            setSelectedBadge={setSelectedBadge}
            setActiveScreen={setActiveScreen}
            setPreviousScreen={setPreviousScreen}
            initialFilter={badgeFilter}
          />
        );

      case "records":
        return (
          <RecordsScreen
            setActiveTab={handleSetActiveTab}
            setActiveScreen={setActiveScreen}
          />
        );

      case "profile":
        return (
          <MyTicketsScreen
            setActiveTab={handleSetActiveTab}
            setActiveScreen={setActiveScreen}
            setSelectedReservation={setSelectedReservation}
            setSelectedBadge={setSelectedBadge}
          />
        );

      default:
        return (
          <HomeScreen
            setActiveTab={handleSetActiveTab}
            searchParams={searchParams}
            setSearchParams={setSearchParams}
            user={user}
          />
        );
    }
  };

  return (
    <SafeAreaProvider>
      {user ? (
        <View style={styles.container}>
          {renderScreen()}
          <StatusBar style="dark" />
        </View>
      ) : (
        <View style={styles.container}>
          <LoginScreen onLogin={setUser} />
          <StatusBar style="light" />
        </View>
      )}
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
