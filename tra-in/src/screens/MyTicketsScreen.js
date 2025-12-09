import React from "react";
import { Text, View, SafeAreaView, ScrollView } from "react-native";
import { screenStyles, contentStyles } from "../constants/screenStyles";
import ScreenHeader from "../components/ScreenHeader";
import BottomNavigation from "../navigation/BottomNavigation";

const MyTicketsScreen = ({ setActiveTab }) => {
  return (
    <SafeAreaView style={screenStyles.container}>
      <ScrollView
        style={screenStyles.content}
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader />

        <View style={screenStyles.body}>
          <Text style={contentStyles.screenTitle}>내 티켓</Text>
          <Text style={contentStyles.screenDescription}>
            예약된 티켓이 여기 표시됩니다
          </Text>
        </View>
      </ScrollView>

      <BottomNavigation activeTab="profile" setActiveTab={setActiveTab} />
    </SafeAreaView>
  );
};

export default MyTicketsScreen;
