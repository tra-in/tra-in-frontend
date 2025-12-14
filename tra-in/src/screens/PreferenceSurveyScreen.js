import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet, Pressable, Alert } from "react-native";
import ScreenHeader from "../components/ScreenHeader";
import { Colors } from "../constants/theme";

/**
 * 임시 선호도 조사 화면
 * - HEALING / ACTIVITY / FOOD 중 하나 선택
 * - 완료 누르면:
 *   - 직행: 도착지 기반 추천 받을지 질문 → Yes면 Travel 추천 화면(TravelScreen flowMode)로
 *   - 메뚜기: 바로 경유지 선택(BookingScreen)으로
 */
export default function PreferenceSurveyScreen({
  setActiveTab,
  setActiveScreen,
  searchParams,
  setUserPreference,
  openTravelFlow,
}) {
  const options = useMemo(
    () => [
      { key: "HEALING", label: "힐링" },
      { key: "ACTIVITY", label: "액티비티" },
      { key: "FOOD", label: "맛집" },
    ],
    []
  );

  const [selected, setSelected] = useState(null);

  const handleComplete = () => {
    if (!searchParams) {
      Alert.alert("오류", "검색 조건이 없습니다. 홈에서 다시 시도해 주세요.");
      setActiveScreen(null);
      setActiveTab("home");
      return;
    }
    if (!selected) {
      Alert.alert("선택 필요", "여행 선호도를 하나 선택해 주세요.");
      return;
    }

    setUserPreference(selected);

    // 메뚜기 예매: 바로 경유지 선택 화면으로
    if (searchParams.isHopper) {
      setActiveScreen(null);
      setActiveTab("booking");
      return;
    }

    // 직행: 도착지 기반 추천 받을지 질문
    const dest = searchParams.destName;
    Alert.alert(
      "여행지 추천",
      `${dest} 지역의 선호도 기반 여행지 추천을 받아볼까요?`,
      [
        {
          text: "아니오",
          style: "cancel",
          onPress: () => {
            setActiveScreen(null);
            setActiveTab("booking");
          },
        },
        {
          text: "네",
          onPress: () => {
            openTravelFlow({ mode: "direct", region: dest });
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScreenHeader
        showBackButton
        onBackPress={() => {
          setActiveScreen(null);
          setActiveTab("home");
        }}
      />

      <View style={styles.body}>
        <Text style={styles.title}>어떤 여행을 원하시나요?</Text>
        <Text style={styles.subtitle}>임시 선택: 힐링 / 액티비티 / 맛집</Text>

        <View style={styles.optionBox}>
          {options.map((opt) => {
            const active = selected === opt.key;
            return (
              <Pressable
                key={opt.key}
                style={[styles.option, active && styles.optionActive]}
                onPress={() => setSelected(opt.key)}
              >
                <Text style={[styles.optionText, active && styles.optionTextActive]}>
                  {opt.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Pressable style={styles.completeButton} onPress={handleComplete}>
          <Text style={styles.completeButtonText}>선호도 조사 완료</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  body: { flex: 1, paddingHorizontal: 20, paddingTop: 16 },
  title: { fontSize: 20, fontWeight: "700", color: "#1F3A5F" },
  subtitle: { marginTop: 8, color: Colors.gray, fontSize: 14 },
  optionBox: { marginTop: 20, gap: 12 },
  option: {
    borderWidth: 1,
    borderColor: "#D6D6D6",
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 14,
  },
  optionActive: {
    borderColor: "#1F3A5F",
    backgroundColor: "#EEF3FA",
  },
  optionText: { fontSize: 16, color: "#333", fontWeight: "600" },
  optionTextActive: { color: "#1F3A5F" },
  completeButton: {
    marginTop: 24,
    backgroundColor: "#1F3A5F",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  completeButtonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
