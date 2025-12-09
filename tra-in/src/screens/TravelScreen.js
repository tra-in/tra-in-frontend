import React from "react";
import { Text, View, SafeAreaView, ScrollView } from "react-native";
import { screenStyles, contentStyles } from "../constants/screenStyles";
import ScreenHeader from "../components/ScreenHeader";
import BottomNavigation from "../navigation/BottomNavigation";

const TravelScreen = ({ setActiveTab }) => {
  return (
    <SafeAreaView style={screenStyles.container}>
      <ScrollView
        style={screenStyles.content}
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader />

        <View style={screenStyles.body}>
          <Text style={contentStyles.screenTitle}>여행</Text>
          <Text style={contentStyles.screenDescription}>
            여행 정보가 여기 표시됩니다
          </Text>
        </View>
      </ScrollView>

      <BottomNavigation activeTab="travel" setActiveTab={setActiveTab} />
    </SafeAreaView>
  );
};

export default TravelScreen;
