// src/screens/AiRecommendDetailScreen.js
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Alert,
} from "react-native";
import ScreenHeader from "../components/ScreenHeader";
import { screenStyles } from "../constants/screenStyles";
import WaypointCard from "../components/WaypointCard";
import { Colors } from "../constants/theme";
import { MaterialIcons } from "@expo/vector-icons";
import { AVATAR } from "../constants/images";
import { API_BASE } from "../config/api";
import {
  NaverMapView,
  NaverMapMarkerOverlay,
} from "@mj-studio/react-native-naver-map";

const { width } = Dimensions.get("window");
const imgAvatar = AVATAR.AVATAR;

const RECOMMENDER_API_BASE = "http://10.0.2.2:8000";
const DEFAULT_BASE = { latitude: 36.3258, longitude: 127.4353 };

const fromName = searchParams?.from ?? "";
const toName = searchParams?.to ?? "";

// ✅ 커스텀 핀 PNG (경로는 AiRecommendDetailScreen.js 기준으로 조정 필요할 수 있음)
const PIN_BLUE = require("../../assets/Icons/blue.png");
const PIN_GRAY = require("../../assets/Icons/gray.png");
const PIN_PINK = require("../../assets/Icons/pink.png");

// ✅ 핀 결정 로직: 기차역(blue) / pinned(pink) / unpinned(gray)
function getMarkerIcon(wp, pinnedIds) {
  const isStation = wp.type === "기차역" || wp.contentId == null;
  if (isStation) return PIN_BLUE;
  if (wp.contentId && pinnedIds.has(wp.contentId)) return PIN_PINK;
  return PIN_GRAY;
}

export default function AiRecommendDetailScreen({
  setActiveTab,
  setActiveScreen,
  searchParams,
  segment = "부산 - 대전",
}) {
  const scrollRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [waypointsState, setWaypointsState] = useState([]);

  // ✅ 하트(고정) / 제외(재추천 금지)
  const [pinnedIds, setPinnedIds] = useState(() => new Set());
  const [excludedIds, setExcludedIds] = useState(() => new Set());

  const userId = searchParams?.userId ?? null;
  const ticketId = searchParams?.ticketId ?? null;
  const destName = searchParams?.destName ?? "";
  const travelPreferenceKorean = searchParams?.travelPreference ?? "";

  const travelPreferenceForApi = useMemo(() => {
    const map = {
      힐링: "relaxation",
      액티비티: "activity",
      맛집: "food",
      쇼핑: "shopping",
      자연: "nature",
      문화: "culture",
    };

    const lowered = String(travelPreferenceKorean).toLowerCase();
    const englishSet = new Set([
      "relaxation",
      "activity",
      "food",
      "shopping",
      "nature",
      "culture",
    ]);
    if (englishSet.has(lowered)) return lowered;
    return map[travelPreferenceKorean] || "nature";
  }, [travelPreferenceKorean]);

  const handleBack = () => {
    if (setActiveTab) setActiveTab("travel");
    if (setActiveScreen) setActiveScreen(null);
  };

  // ✅ 추천 API 요청 바디
  const buildRecommendBody = (excludeSet) => {
    const query =
      travelPreferenceKorean && destName
        ? `${destName}에서 ${travelPreferenceKorean} 중심으로 갈만한 곳 추천`
        : "가까운 여행지 추천";

    const excludeIdsArr = Array.from(excludeSet ?? []);

    return {
      latitude: DEFAULT_BASE.latitude,
      longitude: DEFAULT_BASE.longitude,
      query,
      travel_preference: travelPreferenceForApi,
      content_types: ["12", "39", "25"],
      max_distance_km: 10,
      n_results: 30,
      distance_weight: 0.4,
      similarity_weight: 0.4,
      preference_weight: 0.2,
      exclude_content_ids: excludeIdsArr, // 추천서버가 지원하면 사용
    };
  };

  // ✅ “역 카드”는 항상 맨 위
  const stationWp = useMemo(() => {
    return {
      number: 1,
      type: "기차역",
      title: destName ? `${destName}역` : "도착역",
      desc: destName ? `기차역 | ${destName}` : "기차역",
      latitude: DEFAULT_BASE.latitude,
      longitude: DEFAULT_BASE.longitude,
      contentId: null,
    };
  }, [destName]);

  // ✅ (선택) 백엔드에서 excluded 목록 가져오기
  const fetchExcludedFromServer = async () => {
    try {
      const res = await fetch(
        `${API_BASE}/user-picks/excluded?userId=${userId}&userTicketId=${ticketId}`
      );
      if (!res.ok) return;
      const json = await res.json();
      const ids = json?.excludedContentIds ?? [];
      setExcludedIds(new Set(ids));
    } catch {
      // 없어도 동작하게 무시
    }
  };

  // ✅ 추천 호출 공통 함수
  const fetchRecommendAndRender = async ({ keepPinned = true } = {}) => {
    const exclude = new Set(excludedIds);
    if (keepPinned) {
      for (const id of pinnedIds) exclude.add(id); // pinned 중복 추천 방지
    }

    const body = buildRecommendBody(exclude);

    const recRes = await fetch(
      `${RECOMMENDER_API_BASE}/api/v1/travel/search/location-hybrid`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );

    if (!recRes.ok) {
      const text = await recRes.text().catch(() => "");
      throw new Error(`추천 API 호출 실패 (${recRes.status}) ${text}`);
    }

    const recJson = await recRes.json();
    const results = recJson?.results ?? [];

    // ✅ 프론트에서도 제외 필터링(추천서버 exclude 미지원 대비)
    const filtered = results.filter((r) => {
      const id = r?.id;
      if (!id) return false;
      if (exclude.has(id)) return false;
      return true;
    });

    // 화면용 변환 (최대 10개)
    const mapped = filtered.slice(0, 10).map((r, idx) => ({
      number: idx + 2,
      type: r.content_type_name || "추천",
      title: r.title || "추천 장소",
      desc: `${r.content_type_name || "추천"} | ${
        r.address || "주소 정보 없음"
      }`,
      contentId: r.id,
      address: r.address,
      latitude: r.latitude,
      longitude: r.longitude,
      distanceKm: r.distance_km,
      imageUrl: r.image_url,
      phone: r.phone,
      contentTypeName: r.content_type_name,
    }));

    // ✅ pinned(고정) 카드들 유지
    const pinnedList = keepPinned
      ? waypointsState.filter((w) => w.contentId && pinnedIds.has(w.contentId))
      : [];

    // ✅ 최종 리스트: [역] + [고정] + [새 추천]
    const finalListRaw = [stationWp, ...pinnedList, ...mapped].filter(
      (w) => w.latitude && w.longitude
    );

    // ✅ number 재부여(리스트 key용/정렬용)
    const finalList = finalListRaw.map((w, idx) => ({
      ...w,
      number: idx + 1,
    }));

    setWaypointsState(finalList);

    return { mappedNew: mapped, finalList };
  };

  // ✅ 최초 진입
  useEffect(() => {
    console.log("[AI DETAIL] searchParams:", searchParams);

    if (!userId || !ticketId) {
      Alert.alert("오류", "추천에 필요한 userId/ticketId가 없습니다.", [
        { text: "OK", onPress: handleBack },
      ]);
      return;
    }

    (async () => {
      try {
        setLoading(true);
        setErrorMsg("");

        await fetchExcludedFromServer();

        const { mappedNew } = await fetchRecommendAndRender({
          keepPinned: true,
        });

        // ✅ 처음 결과 저장(우리 백엔드)
        setSaving(true);
        const saveRes = await fetch(`${API_BASE}/user-picks/bulk`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            userTicketId: ticketId,
            destStation: destName,
            picks: mappedNew.map((m) => ({
              contentId: m.contentId,
              title: m.title,
              address: m.address,
              distanceKm: m.distanceKm,
              contentTypeName: m.contentTypeName,
              latitude: m.latitude,
              longitude: m.longitude,
              imageUrl: m.imageUrl,
              phone: m.phone,
              startTime: null,
              endTime: null,
            })),
          }),
        });

        if (!saveRes.ok) {
          const text = await saveRes.text().catch(() => "");
          console.log("[WARN] user_pick 저장 실패:", saveRes.status, text);
        }
      } catch (e) {
        setErrorMsg(e?.message ?? "추천 결과를 불러오지 못했어요.");
        setWaypointsState([]);
      } finally {
        setSaving(false);
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, ticketId, destName, travelPreferenceForApi]);

  // ✅ 하트 토글
  const togglePin = (contentId) => {
    if (!contentId) return;
    setPinnedIds((prev) => {
      const next = new Set(prev);
      if (next.has(contentId)) next.delete(contentId);
      else next.add(contentId);
      return next;
    });
  };

  // ✅ 새로고침: 미고정은 삭제+제외 등록, pinned는 유지
  const handleRefresh = async () => {
    if (!userId || !ticketId) return;

    try {
      setRefreshing(true);

      // 1) 현재 리스트에서 “미고정 contentId” 추출 (기차역 제외)
      const removable = waypointsState
        .filter((w) => w.contentId)
        .filter((w) => !pinnedIds.has(w.contentId))
        .map((w) => w.contentId);

      // 2) 서버 cleanup 요청 (삭제 + excluded 등록)
      if (removable.length > 0) {
        const cleanupRes = await fetch(
          `${API_BASE}/user-picks/refresh-cleanup`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId,
              userTicketId: ticketId,
              destStation: destName,
              removeContentIds: removable,
              keepContentIds: Array.from(pinnedIds),
            }),
          }
        );

        if (!cleanupRes.ok) {
          const text = await cleanupRes.text().catch(() => "");
          console.log("[WARN] refresh-cleanup 실패:", cleanupRes.status, text);
        }
      }

      // 3) excludedIds에 removable 추가
      setExcludedIds((prev) => {
        const next = new Set(prev);
        for (const id of removable) next.add(id);
        return next;
      });

      // 4) 추천 다시 받기 + 화면 반영 (pinned 유지)
      const { mappedNew } = await fetchRecommendAndRender({ keepPinned: true });

      // 5) 새로 받은 것들만 다시 user_pick 저장
      setSaving(true);
      const saveRes = await fetch(`${API_BASE}/user-picks/bulk`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          userTicketId: ticketId,
          destStation: destName,
          picks: mappedNew.map((m) => ({
            contentId: m.contentId,
            title: m.title,
            address: m.address,
            distanceKm: m.distanceKm,
            contentTypeName: m.contentTypeName,
            latitude: m.latitude,
            longitude: m.longitude,
            imageUrl: m.imageUrl,
            phone: m.phone,
            startTime: null,
            endTime: null,
          })),
        }),
      });

      if (!saveRes.ok) {
        const text = await saveRes.text().catch(() => "");
        console.log("[WARN] user_pick 저장 실패:", saveRes.status, text);
      }

      requestAnimationFrame(() => {
        scrollRef.current?.scrollTo({ y: 0, animated: true });
      });
    } catch (e) {
      Alert.alert("오류", e?.message ?? "새로고침 중 문제가 발생했어요.");
    } finally {
      setSaving(false);
      setRefreshing(false);
    }
  };

  const routeLabel = useMemo(() => {
    if (fromName && toName) return `${fromName} - ${toName}`;
    // 혹시 searchParams가 없거나 비어있을 때만 segment fallback
    return segment;
  }, [fromName, toName, segment]);

  // ✅ 지도 중심: 리스트 맨 위(기차역) 기준
  const camera = useMemo(() => {
    const station = waypointsState?.[0];
    return {
      latitude: station?.latitude ?? DEFAULT_BASE.latitude,
      longitude: station?.longitude ?? DEFAULT_BASE.longitude,
      zoom: 14,
    };
  }, [waypointsState]);

  // ✅ 지도에 찍을 좌표만 필터링
  const markers = useMemo(() => {
    return waypointsState.filter((w) => w.latitude && w.longitude);
  }, [waypointsState]);

  return (
    <View style={screenStyles.container}>
      <ScreenHeader
        title="트레:in(人)"
        showBackButton={true}
        onBackPress={handleBack}
      />

      <View style={styles.container}>
        {/* 지도 */}
        <View style={styles.mapWrap}>
          <NaverMapView
            style={styles.mapImg}
            initialCamera={camera}
            isShowZoomControls={true}
            isShowCompass={false}
            isShowLocationButton={false}
          >
            {markers.map((w) => (
              <NaverMapMarkerOverlay
                key={`${w.number}-${w.title}`}
                latitude={w.latitude}
                longitude={w.longitude}
                image={getMarkerIcon(w, pinnedIds)} // ✅ PNG 핀 적용
                width={32}
                height={42}
                anchor={{ x: 0.5, y: 1 }} // ✅ 핀 끝이 좌표에 맞도록
              />
            ))}
          </NaverMapView>

          <View style={styles.routeSummary}>
            <Image source={imgAvatar} style={styles.avatarSmall} />
            <Text style={styles.routeText}>{routeLabel}</Text>
            {/* <Text style={styles.routeText}>{segment}</Text> */}
          </View>
        </View>

        {/* 로딩/에러 */}
        {loading ? (
          <View style={{ width: 332, alignItems: "center", paddingTop: 16 }}>
            <ActivityIndicator />
            <Text style={{ marginTop: 10, color: Colors.korailGray }}>
              추천 장소 불러오는 중...
            </Text>
          </View>
        ) : errorMsg ? (
          <View style={{ width: 332, alignItems: "center", paddingTop: 16 }}>
            <Text style={{ color: "crimson", textAlign: "center" }}>
              {errorMsg}
            </Text>
          </View>
        ) : (
          <>
            {/* ✅ 헤더: 새로고침 버튼 */}
            <View style={styles.listHeaderRow}>
              <View style={{ flex: 1 }}>
                <Text style={{ color: Colors.korailGray, fontSize: 12 }}>
                  {refreshing
                    ? "새 추천 불러오는 중..."
                    : saving
                    ? "추천 저장 중..."
                    : "추천 결과"}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.refreshBtn}
                onPress={handleRefresh}
                disabled={refreshing || saving}
              >
                <MaterialIcons
                  name="refresh"
                  size={22}
                  color={
                    refreshing || saving
                      ? Colors.korailSilver
                      : Colors.korailGray
                  }
                />
              </TouchableOpacity>
            </View>

            {/* 리스트 */}
            <ScrollView
              ref={scrollRef}
              style={styles.detailSection}
              contentContainerStyle={{ paddingBottom: 40 }}
            >
              {waypointsState.map((wp, idx) => {
                const isStation = wp.type === "기차역" || wp.contentId == null;
                const pinned = wp.contentId
                  ? pinnedIds.has(wp.contentId)
                  : false;

                return (
                  <View key={`${wp.number}-${idx}`}>
                    <WaypointCard
                      {...wp}
                      showDivider
                      onDirectionsPress={() => {}}
                      showPin={!isStation}
                      isPinned={pinned}
                      onTogglePin={() => togglePin(wp.contentId)}
                    />
                  </View>
                );
              })}
            </ScrollView>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  mapWrap: {
    width: 332,
    height: 301,
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 24,
    marginBottom: 16,
    position: "relative",
  },
  mapImg: {
    width: 332,
    height: 301,
    borderRadius: 10,
  },
  routeSummary: {
    position: "absolute",
    top: 11,
    left: 7,
    backgroundColor: "#fff",
    borderColor: "#d9d9d9",
    borderWidth: 1,
    borderRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  avatarSmall: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 6,
  },
  routeText: {
    fontSize: 12,
    color: "#000",
  },
  detailSection: {
    width: 332,
    flex: 1,
  },
  listHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    width: 332,
    marginBottom: 2,
  },
  refreshBtn: {
    padding: 6,
  },
});
