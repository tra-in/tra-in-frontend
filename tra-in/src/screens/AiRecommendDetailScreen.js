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

// ✅ 너의 추천 서버 주소로 바꿔줘!
const RECOMMENDER_API_BASE = "http://10.0.2.2:8000";

// ✅ 기본 좌표(임시) : 나중에 실제 도착역 좌표/현재 위치로 바꾸면 됨
const DEFAULT_BASE = { latitude: 36.3258, longitude: 127.4353 }; // 대전역 근처(대략)

export default function AiRecommendDetailScreen({
  setActiveTab,
  setActiveScreen,

  // ✅ 여기로 TravelScreen/PreferenceSurvey에서 만든 searchParams를 그대로 넘겨줘야 함
  searchParams,

  // (선택) 화면 상단에 표시할 구간 라벨
  segment = "부산 - 대전",
}) {
  const scrollRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [waypointsState, setWaypointsState] = useState([]);

  // ✅ searchParams에서 필수 값 뽑기
  const userId = searchParams?.userId ?? null;
  const ticketId = searchParams?.ticketId ?? null;
  const destName = searchParams?.destName ?? ""; // 예: "대전"
  const travelPreferenceKorean = searchParams?.travelPreference ?? ""; // 예: "맛집" / "자연" 등

  // ✅ 추천 API가 요구하는 travel_preference 값(영문) 매핑
  // (swagger 예시: "nature")
  const travelPreferenceForApi = useMemo(() => {
    // 프론트에서 한글을 받는다면 아래에서 영어로 바꿔서 추천 API에 전달
    // (백엔드 user_preference는 한글 enum 그대로 유지해도 됨)
    const map = {
      힐링: "relaxation",
      액티비티: "activity",
      맛집: "food",
      쇼핑: "shopping",
      자연: "nature",
      문화: "culture",
    };

    // 이미 영어로 넘어오는 경우도 대비
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

  // ✅ 추천 API 요청 바디 만들기 (swagger 기반)
  const buildRecommendBody = () => {
    // query는 없어도 동작할 수 있지만 있으면 더 좋아 (자연어)
    const query =
      travelPreferenceKorean && destName
        ? `${destName}에서 ${travelPreferenceKorean} 중심으로 갈만한 곳 추천`
        : "가까운 여행지 추천";

    return {
      latitude: DEFAULT_BASE.latitude,
      longitude: DEFAULT_BASE.longitude,
      query,
      travel_preference: travelPreferenceForApi,
      content_types: ["12", "39", "25"], // 예시: 관광지/맛집/여행코스 등 (원하면 수정)
      max_distance_km: 10,
      n_results: 10,
      distance_weight: 0.4,
      similarity_weight: 0.4,
      preference_weight: 0.2,
    };
  };

  const handleBack = () => {
    if (setActiveTab) setActiveTab("travel");
    if (setActiveScreen) setActiveScreen(null);
  };

  const renumber = (list) => list.map((w, idx) => ({ ...w, number: idx + 1 }));

  const handleToggleEdit = () => {
    setIsEditing((v) => {
      const next = !v;
      requestAnimationFrame(() => {
        scrollRef.current?.scrollTo({ y: 0, animated: true });
      });
      return next;
    });
  };

  const handleRemove = (index) => {
    setWaypointsState((prev) => renumber(prev.filter((_, i) => i !== index)));
  };

  const handleAddAfter = (index) => {
    const dummy = {
      number: 0,
      type: "관광",
      title: "새 경유지",
      desc: "관광 | 주소를 입력해주세요",
      latitude: DEFAULT_BASE.latitude,
      longitude: DEFAULT_BASE.longitude,
    };

    setWaypointsState((prev) => {
      const next = [...prev];
      next.splice(index + 1, 0, dummy);
      return renumber(next);
    });
  };

  // ✅ userId/ticketId 없으면 바로 차단 (네가 본 오류 원인)
  useEffect(() => {
    console.log("[AI DETAIL] searchParams:", searchParams);

    if (!userId || !ticketId) {
      Alert.alert("오류", "추천에 필요한 userId/ticketId가 없습니다.", [
        { text: "OK", onPress: handleBack },
      ]);
      return;
    }
  }, [userId, ticketId]);

  useEffect(() => {
    const fetchRecommend = async () => {
      if (!userId || !ticketId) return;

      try {
        setLoading(true);
        setErrorMsg("");

        // 1) 추천 API 호출
        const body = buildRecommendBody();

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

        // 2) 화면에 표시할 waypoints로 변환
        // - 1번은 도착역(또는 대표 지점)으로 고정
        const stationWp = {
          number: 1,
          type: "기차역",
          title: destName ? `${destName}역` : "도착역",
          desc: destName ? `기차역 | ${destName}` : "기차역",
          latitude: DEFAULT_BASE.latitude,
          longitude: DEFAULT_BASE.longitude,
        };

        const mapped = results.map((r, idx) => ({
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

        const finalList = [stationWp, ...mapped].filter(
          (w) => w.latitude && w.longitude
        );

        setWaypointsState(finalList);

        // 3) user_pick 저장(우리 백엔드)
        // ✅ 백엔드에 아래 엔드포인트 구현해두면 그대로 저장됨
        // POST /api/user-picks  (body: { userId, ticketId, destStation, picks: [...] })
        setSaving(true);

        const saveRes = await fetch(`${API_BASE}/user-picks/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            ticketId, // user_tickets.ticket_id
            destStation: destName,
            picks: mapped.map((m) => ({
              contentId: m.contentId,
              title: m.title,
              address: m.address,
              distanceKm: m.distanceKm,
              contentTypeName: m.contentTypeName,
              latitude: m.latitude,
              longitude: m.longitude,
              imageUrl: m.imageUrl,
              phone: m.phone,
              // startTime/endTime은 지금 null로 두고, 나중에 로직 생기면 채우자
              startTime: null,
              endTime: null,
            })),
          }),
        });

        if (!saveRes.ok) {
          const text = await saveRes.text().catch(() => "");
          console.log("[WARN] user_pick 저장 실패:", saveRes.status, text);
          // 저장 실패는 화면 표시를 막지 않게 경고만
        }
      } catch (e) {
        setErrorMsg(e?.message ?? "추천 결과를 불러오지 못했어요.");
        setWaypointsState([]);
      } finally {
        setSaving(false);
        setLoading(false);
      }
    };

    fetchRecommend();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, ticketId, destName, travelPreferenceForApi]);

  // ✅ 지도 마커용
  const waypointsWithCoords = useMemo(() => {
    return waypointsState.map((w, idx) => ({
      ...w,
      latitude: w.latitude,
      longitude: w.longitude,
    }));
  }, [waypointsState]);

  const camera = useMemo(() => {
    const first = waypointsWithCoords?.[0];
    return {
      latitude: first?.latitude ?? DEFAULT_BASE.latitude,
      longitude: first?.longitude ?? DEFAULT_BASE.longitude,
      zoom: 14,
    };
  }, [waypointsWithCoords]);

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
            {waypointsWithCoords.map((w) => (
              <NaverMapMarkerOverlay
                key={`${w.number}-${w.title}`}
                latitude={w.latitude}
                longitude={w.longitude}
                caption={{ text: String(w.number) }}
              />
            ))}
          </NaverMapView>

          <View style={styles.routeSummary}>
            <Image source={imgAvatar} style={styles.avatarSmall} />
            <Text style={styles.routeText}>{segment}</Text>
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
            {/* 편집 버튼 */}
            <View style={styles.listHeaderRow}>
              <View style={{ flex: 1 }}>
                <Text style={{ color: Colors.korailGray, fontSize: 12 }}>
                  {saving ? "추천 저장 중..." : "추천 결과"}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.editBtn}
                onPress={handleToggleEdit}
              >
                <MaterialIcons
                  name={isEditing ? "check" : "edit"}
                  size={22}
                  color={isEditing ? "#FF81B9" : Colors.korailGray}
                />
              </TouchableOpacity>
            </View>

            {/* 리스트 */}
            <ScrollView
              ref={scrollRef}
              style={styles.detailSection}
              contentContainerStyle={{ paddingBottom: 40 }}
            >
              {waypointsState.map((wp, idx) => (
                <View key={`${wp.number}-${idx}`}>
                  <WaypointCard
                    {...wp}
                    showDivider
                    isEditing={isEditing}
                    onRemove={() => handleRemove(idx)}
                    onDirectionsPress={() => {}}
                  />

                  {isEditing && (
                    <View style={styles.addRow}>
                      <TouchableOpacity
                        onPress={() => handleAddAfter(idx)}
                        style={styles.addBtn}
                      >
                        <MaterialIcons
                          name="add"
                          size={18}
                          color={Colors.white}
                        />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              ))}
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
  editBtn: {
    padding: 6,
  },
  addRow: {
    alignItems: "flex-start",
    paddingLeft: 38,
    marginTop: -4,
    marginBottom: 10,
  },
  addBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#2F80FF",
    alignItems: "center",
    justifyContent: "center",
  },
});
