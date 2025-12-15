import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Button,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import ScreenHeader from "../components/ScreenHeader";
import LoadingScreen from "./LoadingScreen";
import { CheckIcon, CheckIconBlue } from "../components/Icons";
import { TRAVEL_API_BASE } from "../config/api";
import {
  mapPreference,
  buildQuery,
  contentTypesFromQuery,
} from "../utils/preference";
import { CITY_CENTER, getCityCenter } from "../utils/geo";

export default function TravelRecommendListScreen({
  // App.js에서 넘겨줄 값들
  flowModeType, // "direct" | "hopper"
  region,
  preference, // "RELAXATION" | "ACTIVITY" | "FOOD" ...
  context, // "wp1" | "wp2" | "dest"
  snapshot, // BookingScreen에서 넘긴 { routeStops, wp1, wp2 } 등

  // App.js가 넘겨줄 콜백 (이름 통일 추천)
  onFlowConfirm, // 담기 눌렀을 때
  onFlowBack, // 경유지 다시 고르기
}) {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [errorText, setErrorText] = useState("");
  const [selectedItems, setSelectedItems] = useState({}); // { itemId: true/false }

  // ✅ 디버그 박스 토글 (원하면 false로)
  const DEBUG = false;

  const center = useMemo(() => getCityCenter(region), [region]);
  const travelPref = useMemo(() => mapPreference(preference), [preference]);
  const query = useMemo(
    () => buildQuery(preference, region),
    [preference, region]
  );

  // query 기반 content_types 도출
  const contentTypes = useMemo(() => contentTypesFromQuery(query), [query]);

  // ✅ Swagger body에 맞춘 payload (필요 시 값만 조정)
  const payload = useMemo(() => {
    return {
      latitude: center.latitude,
      longitude: center.longitude,
      query,
      travel_preference: travelPref,

      // query 기반 content types
      content_types: contentTypes,
      max_distance_km: 60,
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
        const res = await fetch(
          `${TRAVEL_API_BASE}/travel/search/location-hybrid`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );

        const data = await res.json();
        if (cancelled) return;

        const list = Array.isArray(data?.results) ? data.results : [];
        const sorted = list.slice().sort((a, b) => {
          const da =
            typeof a?.distance_km === "number" ? a.distance_km : Infinity;
          const db =
            typeof b?.distance_km === "number" ? b.distance_km : Infinity;
          return da - db;
        });
        setItems(sorted);
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
            <Text style={styles.debugText}>
              preference(raw): {String(preference)}
            </Text>
            <Text style={styles.debugText}>
              travel_preference: {travelPref}
            </Text>
            <Text style={styles.debugText}>
              center: {center.latitude}, {center.longitude}
            </Text>
            <Text style={styles.debugText}>query: {query}</Text>
            <ScrollView style={{ maxHeight: 120, marginTop: 8 }}>
              <Text style={styles.debugJson}>
                {JSON.stringify(payload, null, 2)}
              </Text>
            </ScrollView>
          </View>
        )}

        {loading ? (
          <LoadingScreen />
        ) : (
          <>
            {errorText ? (
              <Text style={{ color: "red", marginBottom: 8 }}>{errorText}</Text>
            ) : null}

            <FlatList
              data={items}
              keyExtractor={(item, idx) => String(item?.id ?? idx)}
              renderItem={({ item }) => {
                const isSelected = selectedItems[item?.id] ?? false;
                return (
                  <View style={styles.cardContainer}>
                    <View style={styles.card}>
                      <TouchableOpacity
                        style={[
                          styles.thumbsUpButton,
                          isSelected && styles.thumbsUpButtonActive,
                        ]}
                        onPress={() => {
                          setSelectedItems((prev) => ({
                            ...prev,
                            [item?.id]: !prev[item?.id],
                          }));
                        }}
                      >
                        {isSelected ? (
                          <CheckIconBlue size={20} />
                        ) : (
                          <CheckIcon size={20} />
                        )}
                      </TouchableOpacity>

                      <Text style={styles.cardTitle}>
                        {item?.title ?? "제목 없음"}
                      </Text>
                      {!!item?.address && (
                        <Text style={styles.cardSub}>{item.address}</Text>
                      )}
                      {typeof item?.distance_km === "number" && (
                        <Text style={styles.cardSub}>
                          거리: {item.distance_km.toFixed(2)} km
                        </Text>
                      )}
                      {!!item?.content_type_name && (
                        <Text style={styles.cardTag}>
                          {item.content_type_name}
                        </Text>
                      )}
                    </View>
                  </View>
                );
              }}
              ListEmptyComponent={<Text>추천 결과가 없습니다.</Text>}
            />
          </>
        )}

        {!loading && (
          <View style={{ marginTop: 12 }}>
            <Button title="경유지 다시 고르기" onPress={() => onFlowBack?.()} />
            <View style={{ height: 8 }} />
            <Button
              title="담기"
              onPress={() => {
                // 선택된 항목들 필터링
                const selectedList = items.filter(
                  (item) => selectedItems[item?.id]
                );
                onFlowConfirm?.({
                  mode: flowModeType,
                  context,
                  region,
                  snapshot,
                  selectedItems: selectedList,
                });
              }}
            />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1, paddingHorizontal: 16, paddingTop: 12 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  cardContainer: {
    marginBottom: 8,
  },
  card: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    position: "relative",
  },
  cardTitle: { fontWeight: "700", marginBottom: 4 },
  cardSub: { color: "#555", fontSize: 12 },
  cardTag: { marginTop: 6, color: "#0A84FF", fontWeight: "600" },

  thumbsUpButton: {
    position: "absolute",
    top: 8,
    right: 8,
    padding: 6,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
  },
  thumbsUpButtonActive: {
    backgroundColor: "#fff3cd",
    borderColor: "#ffc107",
  },
  thumbsUpText: {
    fontSize: 24,
  },

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
