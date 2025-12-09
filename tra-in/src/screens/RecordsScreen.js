import React from "react";
import { Text, View, SafeAreaView, ScrollView } from "react-native";
import { screenStyles, contentStyles } from "../constants/screenStyles";
import ScreenHeader from "../components/ScreenHeader";
import BottomNavigation from "../navigation/BottomNavigation";

const RecordsScreen = ({ setActiveTab }) => {
  return (
    <SafeAreaView style={screenStyles.container}>
      <ScrollView
        style={screenStyles.content}
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader />

        <View style={screenStyles.body}>
          <Text style={contentStyles.screenTitle}>기록</Text>
          <Text style={contentStyles.screenDescription}>
            여행 기록이 여기 표시됩니다
          </Text>
        </View>
      </ScrollView>

      <BottomNavigation activeTab="records" setActiveTab={setActiveTab} />
    </SafeAreaView>
  );
};

export default RecordsScreen;
