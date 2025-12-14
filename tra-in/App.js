import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
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
import PreferenceSurveyScreen from "./src/screens/PreferenceSurveyScreen";
import LoginScreen from "./src/screens/LoginScreen";
import TravelRecommendListScreen from "./src/screens/TravelRecommendListScreen";

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

  const [userPreference, setUserPreference] = useState(null); // HEALING | ACTIVITY | FOOD

  // travelFlow: { mode, region, context }
  const [travelFlow, setTravelFlow] = useState(null);

  // TravelScreen -> BookingScreen으로 돌아올 때 전달
  const [pendingFlowResult, setPendingFlowResult] = useState(null);

  // ✅ BookingScreen이 언마운트돼도 진행 상태 보존용
  // 예: { mode, step, waypointPhase, routeStops, wp1, wp2, wp2Candidates, selectedTrains, selectedSeats }
  const [bookingDraft, setBookingDraft] = useState(null);

  const openTravelFlow = ({ mode, region, context, snapshot }) => {
    setTravelFlow({ mode, region, context, snapshot });
    setActiveScreen("travelFlow");
  };

  const renderScreen = () => {
    if (activeScreen === "reservationDetail" && selectedReservation) {
      return (
        <ReservationDetailScreen
          setActiveTab={setActiveTab}
          setActiveScreen={setActiveScreen}
          reservation={selectedReservation}
        />
      );
    }

    if (activeScreen === "placeDetail" && selectedPlace) {
      return (
        <PlaceDetailScreen
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setActiveScreen={setActiveScreen}
          place={selectedPlace}
          previousScreen={previousScreen}
        />
      );
    }

    if (activeScreen === "preferenceSurvey") {
      return (
        <PreferenceSurveyScreen
          setActiveTab={setActiveTab}
          setActiveScreen={setActiveScreen}
          searchParams={searchParams}
          setUserPreference={setUserPreference}
          openTravelFlow={openTravelFlow}
        />
      );
    }

    // ✅ 추천 여행지(플로우) 화면
    if (activeScreen === "travelFlow" && travelFlow) {
      return (
        <TravelRecommendListScreen
          region={travelFlow.region}
          preference={userPreference}
          flowModeType={travelFlow.mode}
          context={travelFlow.context}
          // BookingScreen이 결과 처리할 수 있게 pendingFlowResult로 넘기는 방식 유지
          onFlowConfirm={() => {
            setPendingFlowResult({
              mode: travelFlow.mode,
              context: travelFlow.context,
              region: travelFlow.region,
              snapshot: travelFlow.snapshot ?? null,
            });
            setTravelFlow(null);
            setActiveScreen(null);
            setActiveTab("booking");
          }}
          onFlowBack={() => {
            const goTab = travelFlow.mode === "hopper" ? "booking" : "home";
            setTravelFlow(null);
            setActiveScreen(null);
            setActiveTab(goTab);
          }}
        />
      );
    }

    if (activeScreen === "cameraChat") {
      return (
        <CameraChatScreen
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setActiveScreen={setActiveScreen}
        />
      );
    }

    if (activeScreen === "badgeDetail" && selectedBadge) {
      return (
        <BadgeDetailScreen
          activeTab={activeTab}
          setActiveTab={setActiveTab}
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
          setActiveTab={setActiveTab}
          setActiveScreen={setActiveScreen}
          setSelectedPlace={setSelectedPlace}
          badge={selectedBadge}
          setPreviousScreen={setPreviousScreen}
        />
      );
    }

    if (activeScreen === "aiRecommendDetail") {
      const AiRecommendDetailScreen =
        require("./src/screens/AiRecommendDetailScreen").default;

      return (
        <AiRecommendDetailScreen
          setActiveTab={setActiveTab}
          setActiveScreen={setActiveScreen}
          segment={selectedSegment ?? "부산 - 대전"}
        />
      );
    }

    switch (activeTab) {
      case "home":
        return (
          <HomeScreen
            setActiveTab={setActiveTab}
            setActiveScreen={setActiveScreen}
            searchParams={searchParams}
            setSearchParams={setSearchParams}
            user={user}
          />
        );

      case "booking":
        return (
          <BookingScreen
            setActiveTab={setActiveTab}
            searchParams={searchParams}
            user={user}
            userPreference={userPreference}
            openTravelFlow={openTravelFlow}
            pendingFlowResult={pendingFlowResult}
            clearPendingFlowResult={() => setPendingFlowResult(null)}
            bookingDraft={bookingDraft}
            setBookingDraft={setBookingDraft}
          />
        );

      case "travel":
        return (
          <TravelScreen
            setActiveTab={setActiveTab}
            setActiveScreen={setActiveScreen}
            setSelectedSegment={setSelectedSegment}
          />
        );

      case "reservationList":
        return (
          <ReservationListScreen
            setActiveTab={setActiveTab}
            setActiveScreen={setActiveScreen}
            setSelectedReservation={setSelectedReservation}
          />
        );

      case "badgeList":
        return (
          <BadgeListScreen
            setActiveTab={setActiveTab}
            setSelectedBadge={setSelectedBadge}
            setActiveScreen={setActiveScreen}
            setPreviousScreen={setPreviousScreen}
          />
        );

      case "records":
        return (
          <RecordsScreen
            setActiveTab={setActiveTab}
            setActiveScreen={setActiveScreen}
          />
        );

      case "profile":
        return (
          <MyTicketsScreen
            setActiveTab={setActiveTab}
            setActiveScreen={setActiveScreen}
            setSelectedReservation={setSelectedReservation}
            setSelectedBadge={setSelectedBadge}
          />
        );

      default:
        return (
          <HomeScreen
            setActiveTab={setActiveTab}
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
