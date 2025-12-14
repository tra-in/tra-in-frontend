import React, { useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, FlatList, Button, ActivityIndicator, ScrollView } from "react-native";
import ScreenHeader from "../components/ScreenHeader";
import { TRAVEL_API_BASE } from "../config/api";

/** ✅ 임시: 도시 중심 좌표 하드코딩 (역/도시 이름 -> 좌표) */
const CITY_CENTER = {
  "강릉": { latitude: 37.7519, longitude: 128.8761 },
  "광명": { latitude: 37.4772, longitude: 126.8664 },
  "광주송정": { latitude: 35.1379, longitude: 126.7931 },
  "김천구미": { latitude: 36.1286, longitude: 128.1112 },
  "대구": { latitude: 35.8714, longitude: 128.6014 },
  "대전": { latitude: 36.3504, longitude: 127.3845 },
  "동대구": { latitude: 35.8784, longitude: 128.6286 },
  "목포": { latitude: 34.8118, longitude: 126.3922 },
  "부산": { latitude: 35.1796, longitude: 129.0756 },
  "서울": { latitude: 37.5665, longitude: 126.9780 },
  "순천": { latitude: 34.9506, longitude: 127.4872 },
  "여수EXPO": { latitude: 34.7604, longitude: 127.6622 },
  "오송": { latitude: 36.6200, longitude: 127.3270 },
  "울산": { latitude: 35.5384, longitude: 129.3114 },
  "익산": { latitude: 35.9483, longitude: 126.9578 },
  "전주": { latitude: 35.8242, longitude: 127.1480 },
  "청량리": { latitude: 37.5802, longitude: 127.0466 },
  "춘천": { latitude: 37.8813, longitude: 127.7298 },
  "포항": { latitude: 36.0190, longitude: 129.3435 },
};

function getCityCenter(region) {
  return CITY_CENTER[region] ?? CITY_CENTER["서울"];
}

/** ✅ 앱 선호도 -> FastAPI travel_preference */
function mapPreference(pref) {
  switch (pref) {
    case "HEALING":
      return "nature";
    case "ACTIVITY":
      return "activity";
    case "FOOD":
      return "food";
    default:
      return "nature";
  }
}

/** ✅ 선호도+지역 -> query 자동 생성 */
function buildQuery(pref, region) {
  switch (pref) {
    case "HEALING":
      return `${region}에서 힐링할 수 있는 잔잔하고 이쁜 산책하기 좋은 공원`;
    case "ACTIVITY":
      return `${region}에서 액티비티를 즐길 수 있는 체험/레저 명소`;
    case "FOOD":
      return `${region}에서 현지 맛집과 분위기 좋은 식당`;
    default:
      return `${region} 여행 추천`;
  }
}

export default function TravelRecommendListScreen({
  // App.js에서 넘겨줄 값들
  flowModeType,   // "direct" | "hopper"
  region,
  preference,     // "HEALING" | "ACTIVITY" | "FOOD" ...
  context,        // "wp1" | "wp2" | "dest"
  snapshot,       // BookingScreen에서 넘긴 { routeStops, wp1, wp2 } 등

  // App.js가 넘겨줄 콜백 (이름 통일 추천)
  onFlowConfirm,  // 담기 눌렀을 때
  onFlowBack,     // 경유지 다시 고르기
}) {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [errorText, setErrorText] = useState("");

  // ✅ 디버그 박스 토글 (원하면 false로)
  const DEBUG = true;

  const center = useMemo(() => getCityCenter(region), [region]);
  const travelPref = useMemo(() => mapPreference(preference), [preference]);
  const query = useMemo(() => buildQuery(preference, region), [preference, region]);

  // ✅ Swagger body에 맞춘 payload (필요 시 값만 조정)
  const payload = useMemo(() => {
    return {
      latitude: center.latitude,
      longitude: center.longitude,
      query,
      travel_preference: travelPref,

      // 너 Swagger 예시 기반 기본값들
      content_types: ["12", "39"], // 예: 관광지/음식점 등 (원하면 나중에 선호도별로 바꿀 수 있음)
      max_distance_km: 10,
      n_results: 10,

      distance_weight: 0.4,
      similarity_weight: 0.4,
      preference_weight: 0.2,
    };
  }, [center, query, travelPref]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setErrorText("");
        setItems([]);

        // ✅ endpoint: /api/v1/travel/search/location-hybrid
        const res = await fetch(`${TRAVEL_API_BASE}/travel/search/location-hybrid`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (cancelled) return;

        const list = Array.isArray(data?.results) ? data.results : [];
        setItems(list);
      } catch (e) {
        if (!cancelled) {
          setErrorText("추천을 불러오지 못했습니다. (서버/네트워크 확인)");
          setItems([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    if (region) load();
    return () => {
      cancelled = true;
    };
  }, [region, payload]);

  return (
    <View style={styles.page}>
      <ScreenHeader
        title={`${region} 추천`}
        showBackButton={true}
        onBackPress={() => onFlowBack?.()}
      />

      <View style={styles.container}>
        {DEBUG && (
          <View style={styles.debugBox}>
            <Text style={styles.debugTitle}>DEBUG</Text>
            <Text style={styles.debugText}>region: {region}</Text>
            <Text style={styles.debugText}>preference(raw): {String(preference)}</Text>
            <Text style={styles.debugText}>travel_preference: {travelPref}</Text>
            <Text style={styles.debugText}>
              center: {center.latitude}, {center.longitude}
            </Text>
            <Text style={styles.debugText}>query: {query}</Text>
            <ScrollView style={{ maxHeight: 120, marginTop: 8 }}>
              <Text style={styles.debugJson}>{JSON.stringify(payload, null, 2)}</Text>
            </ScrollView>
          </View>
        )}

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator />
            <Text style={{ marginTop: 8 }}>추천 불러오는 중...</Text>
          </View>
        ) : (
          <>
            {errorText ? <Text style={{ color: "red", marginBottom: 8 }}>{errorText}</Text> : null}

            <FlatList
              data={items}
              keyExtractor={(item, idx) => String(item?.id ?? idx)}
              renderItem={({ item }) => (
                <View style={styles.card}>
                  <Text style={styles.cardTitle}>{item?.title ?? "제목 없음"}</Text>
                  {!!item?.address && <Text style={styles.cardSub}>{item.address}</Text>}
                  {typeof item?.distance_km === "number" && (
                    <Text style={styles.cardSub}>거리: {item.distance_km.toFixed(2)} km</Text>
                  )}
                  {!!item?.content_type_name && (
                    <Text style={styles.cardTag}>{item.content_type_name}</Text>
                  )}
                </View>
              )}
              ListEmptyComponent={<Text>추천 결과가 없습니다.</Text>}
            />
          </>
        )}

        <View style={{ marginTop: 12 }}>
          <Button
            title="경유지 다시 고르기"
            onPress={() => onFlowBack?.()}
          />
          <View style={{ height: 8 }} />
          <Button
            title="담기"
            onPress={() =>
              onFlowConfirm?.({
                mode: flowModeType,
                context,
                region,
                snapshot,
              })
            }
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1, paddingHorizontal: 16, paddingTop: 12 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  card: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    marginBottom: 8,
  },
  cardTitle: { fontWeight: "700", marginBottom: 4 },
  cardSub: { color: "#555", fontSize: 12 },
  cardTag: { marginTop: 6, color: "#0A84FF", fontWeight: "600" },

  debugBox: {
    borderWidth: 1,
    borderColor: "#bbb",
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
    backgroundColor: "#fafafa",
  },
  debugTitle: { fontWeight: "800", marginBottom: 6 },
  debugText: { fontSize: 12, color: "#333" },
  debugJson: { fontSize: 11, color: "#333" },
});
