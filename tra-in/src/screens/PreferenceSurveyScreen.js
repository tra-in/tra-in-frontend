import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet, Pressable, Alert } from "react-native";
import ScreenHeader from "../components/ScreenHeader";
import { Colors } from "../constants/theme";
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
          ticketId: searchParams.ticketId, // ✅ 핵심
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
    <View style={styles.container}>
      <ScreenHeader showBackButton />

      <Text style={styles.title}>어떤 여행을 원하시나요?</Text>

      {options.map((opt) => (
        <Pressable
          key={opt.key}
          style={[styles.option, selected === opt.key && styles.optionActive]}
          onPress={() => setSelected(opt.key)}
        >
          <Text>{opt.label}</Text>
        </Pressable>
      ))}

      <Pressable style={styles.button} onPress={handleComplete}>
        <Text style={{ color: "#fff" }}>선호도 조사 완료</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 20 },
  option: {
    padding: 16,
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 10,
  },
  optionActive: {
    backgroundColor: "#EEF3FA",
    borderColor: "#1F3A5F",
  },
  button: {
    marginTop: 24,
    backgroundColor: "#1F3A5F",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
  },
});
