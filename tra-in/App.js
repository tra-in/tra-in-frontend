import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import React, { useState } from "react";
import HomeScreen from "./src/screens/HomeScreen";
import TravelScreen from "./src/screens/TravelScreen";
import RecordsScreen from "./src/screens/RecordsScreen";
import MyTicketsScreen from "./src/screens/MyTicketsScreen";
import BadgeListScreen from "./src/screens/BadgeListScreen";
import BadgeDetailScreen from "./src/screens/BadgeDetailScreen";
import BadgeCompletedScreen from "./src/screens/BadgeCompletedScreen";

export default function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [activeScreen, setActiveScreen] = useState(null);
  const [selectedBadge, setSelectedBadge] = useState(null);

  const renderScreen = () => {
    // 뱃지 상세 화면 우선 처리
    if (activeScreen === "badgeDetail" && selectedBadge) {
      return <BadgeDetailScreen setActiveTab={setActiveTab} setActiveScreen={setActiveScreen} badge={selectedBadge} />;
    }
    if (activeScreen === "badgeCompleted" && selectedBadge) {
      return <BadgeCompletedScreen setActiveTab={setActiveTab} setActiveScreen={setActiveScreen} badge={selectedBadge} />;
    }

    // 기본 탭 화면
    switch (activeTab) {
      case "home":
        return <HomeScreen setActiveTab={setActiveTab} />;
      case "travel":
        return <TravelScreen setActiveTab={setActiveTab} />;
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
