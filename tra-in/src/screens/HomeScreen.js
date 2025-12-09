import React from "react";
import { SafeAreaView, ScrollView, View } from "react-native";
import { screenStyles } from "../constants/screenStyles";
import ScreenHeader from "../components/ScreenHeader";
import TicketBookingCard from "../components/TicketBookingCard";
import BottomNavigation from "../navigation/BottomNavigation";

const HomeScreen = ({ setActiveTab }) => {
  return (
    <SafeAreaView style={screenStyles.container}>
      <ScrollView
        style={screenStyles.content}
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader />
        <View style={screenStyles.body}>
          <TicketBookingCard />
        </View>
      </ScrollView>

      <BottomNavigation activeTab="home" setActiveTab={setActiveTab} />
    </SafeAreaView>
  );
};

export default HomeScreen;
