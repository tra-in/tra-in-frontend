import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet, Pressable, Alert } from "react-native";
import ScreenHeader from "../components/ScreenHeader";
import { screenStyles } from "../constants/screenStyles";
import { API_BASE } from "../config/api";

export default function PreferenceSurveyScreen({
  setActiveTab,
  setActiveScreen,
  searchParams,
  setSearchParams,
  openTravelFlow,
}) {
  const options = useMemo(
    () => [
      { key: "relaxation", label: "힐링" },
      { key: "activity", label: "액티비티" },
      { key: "food", label: "맛집" },
      { key: "shopping", label: "쇼핑" },
      { key: "nature", label: "자연" },
      { key: "culture", label: "문화" },
    ],
    []
  );

  const [selected, setSelected] = useState(null);

  const handleComplete = async () => {
    if (!searchParams?.ticketId) {
      Alert.alert("오류", "ticketId가 없습니다.");
      return;
    }
    if (!selected) {
      Alert.alert("오류", "선호도를 선택해주세요.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/user-preferences`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: searchParams.userId,
          ticketId: searchParams.ticketId,
          travelPreference: selected,
        }),
      });

      if (!res.ok) throw new Error("선호도 저장 실패");

      setSearchParams?.((prev) => ({
        ...prev,
        travelPreference: selected,
      }));

      openTravelFlow({
        region: searchParams.destName,
        preference: selected,
      });
    } catch (e) {
      Alert.alert("오류", e.message);
    }
  };

  return (
    <View style={screenStyles.container}>
      <ScreenHeader
        showBackButton={true}
        title="트레:in(人)"
        onBackPress={() => setActiveScreen(null)}
      />

      {/* ✅ 폭 제한 + 가운데 정렬 래퍼 */}
      <View style={styles.content}>
        <Text style={styles.title}>어떤 여행을 원하시나요?</Text>

        {options.map((opt) => (
          <Pressable
            key={opt.key}
            style={[styles.option, selected === opt.key && styles.optionActive]}
            onPress={() => setSelected(opt.key)}
          >
            <Text style={styles.optionText}>{opt.label}</Text>
          </Pressable>
        ))}

        <Pressable style={styles.button} onPress={handleComplete}>
          <Text style={styles.buttonText}>선호도 조사 완료</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // ✅ 핵심: 화면 전체를 쓰되, 실제 콘텐츠는 maxWidth로 제한
  content: {
    flex: 1,
    width: "100%",
    maxWidth: 360, // <- 여기 숫자만 취향대로 (332~360 추천)
    alignSelf: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  title: { fontSize: 20, fontWeight: "700", marginBottom: 20 },

  option: {
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderRadius: 16,
    marginBottom: 12,
  },
  optionActive: {
    backgroundColor: "#EEF3FA",
    borderColor: "#1F3A5F",
  },
  optionText: {
    fontSize: 16,
  },

  button: {
    marginTop: 18,
    backgroundColor: "#1F3A5F",
    paddingVertical: 18,
    borderRadius: 18,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "600" },
});
