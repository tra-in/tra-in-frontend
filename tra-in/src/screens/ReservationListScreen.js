import React from "react";
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { screenStyles } from "../constants/screenStyles";
import { Spacing } from "../constants/theme";
import ScreenHeader from "../components/ScreenHeader";
import BottomNavigation from "../navigation/BottomNavigation";
import ReservationCard from "../components/ReservationCard";
import { dummyReservations } from "../data/dummyReservations";

const ReservationListScreen = ({ setActiveTab, setActiveScreen, setSelectedReservation }) => {
  const handleReservationPress = (reservation) => {
    setSelectedReservation(reservation);
    setActiveScreen("reservationDetail");
  };

  return (
    <SafeAreaView style={screenStyles.container}>
      <ScreenHeader
        showBackButton={true}
        title="예약 목록"
        onBackPress={() => setActiveTab("profile")}
      />
      <ScrollView
        style={screenStyles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={screenStyles.body}>
          {dummyReservations.map((reservation) => (
            <ReservationCard
              key={reservation.id}
              reservation={reservation}
              onPress={() => handleReservationPress(reservation)}
            />
          ))}
        </View>
      </ScrollView>
      <BottomNavigation activeTab="profile" setActiveTab={setActiveTab} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: Spacing.lg,
  },
});

export default ReservationListScreen;
