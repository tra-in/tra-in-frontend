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
import LoginScreen from "./src/screens/LoginScreen";

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
  const [badgeFilter, setBadgeFilter] = useState(null); // "incomplete" | null

  // setActiveTab 함수를 래핑하여 필터 파라미터 처리
  const handleSetActiveTab = (tab, options) => {
    if (tab === "badgeList" && options?.filter) {
      setBadgeFilter(options.filter);
    } else if (tab !== "badgeList") {
      setBadgeFilter(null);
    }
    setActiveTab(tab);
  };

  const renderScreen = () => {
    // 예약 상세 화면
    if (activeScreen === "reservationDetail" && selectedReservation) {
      return (
        <ReservationDetailScreen
          setActiveTab={handleSetActiveTab}
          setActiveScreen={setActiveScreen}
          reservation={selectedReservation}
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
    // 뱃지 상세 화면 우선 처리
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

    if (activeScreen === "aiRecommendDetail") {
      const AiRecommendDetailScreen =
        require("./src/screens/AiRecommendDetailScreen").default;

      return (
        <AiRecommendDetailScreen
          setActiveTab={handleSetActiveTab}
          setActiveScreen={setActiveScreen}
          segment={selectedSegment ?? "부산 - 대전"}
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
