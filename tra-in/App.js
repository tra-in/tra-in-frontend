import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import React, { useState } from "react";
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
import BookingScreen from "./src/screens/BookingScreen";

export default function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [searchParams, setSearchParams] = useState(null);
  const [activeScreen, setActiveScreen] = useState(null);
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [selectedReservation, setSelectedReservation] = useState(null);

  const renderScreen = () => {
    // 예약 상세 화면
    if (activeScreen === "reservationDetail" && selectedReservation) {
      return <ReservationDetailScreen setActiveTab={setActiveTab} setActiveScreen={setActiveScreen} reservation={selectedReservation} />;
    }
    
    // 장소 상세 화면
    if (activeScreen === "placeDetail" && selectedPlace) {
      return <PlaceDetailScreen setActiveTab={setActiveTab} setActiveScreen={setActiveScreen} place={selectedPlace} />;
    }
    
    // 뱃지 상세 화면 우선 처리
    if (activeScreen === "badgeDetail" && selectedBadge) {
      return <BadgeDetailScreen setActiveTab={setActiveTab} setActiveScreen={setActiveScreen} setSelectedPlace={setSelectedPlace} badge={selectedBadge} />;
    }
    if (activeScreen === "badgeCompleted" && selectedBadge) {
      return <BadgeCompletedScreen setActiveTab={setActiveTab} setActiveScreen={setActiveScreen} setSelectedPlace={setSelectedPlace} badge={selectedBadge} />;
    }

    // 기본 탭 화면
    switch (activeTab) {
      case "home":
        return <HomeScreen
         setActiveTab={setActiveTab}
         setSearchParams={setSearchParams}
         />;
      case "booking":
        return <BookingScreen
          setActiveTab={setActiveTab}
          searchParams={searchParams}
        />;
      case "travel":
        return <TravelScreen setActiveTab={setActiveTab} />;
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
          />
        );
      case "records":
        return <RecordsScreen setActiveTab={setActiveTab} />;
      case "profile":
        return <MyTicketsScreen setActiveTab={setActiveTab} />;
      default:
        return <HomeScreen setActiveTab={setActiveTab} />;
    }
  };

  return (
    <View style={styles.container}>
      {renderScreen()}
      <StatusBar style="dark" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
