import React, { useMemo, useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import ScreenHeader from "../components/ScreenHeader";
import { screenStyles } from "../constants/screenStyles";
import WaypointCard from "../components/WaypointCard";
import WaypointActionButton from "../components/WaypointActionButton";
import { Colors } from "../constants/theme";
import { MaterialIcons } from "@expo/vector-icons";
import { IMAGES, AVATAR } from "../constants/images";
import {
  NaverMapView,
  NaverMapMarkerOverlay,
} from "@mj-studio/react-native-naver-map";

const { width } = Dimensions.get("window");

const imgAvatar = AVATAR.AVATAR;

const waypoints = [
  {
    number: 1,
    color: "#005db3",
    title: "대전역",
    desc: "기차역 | 대전 동구 중앙로 215",
  },
  {
    number: 2,
    color: "#ff81b9",
    title: "김화칼국수",
    desc: "맛집/카페 | 대전 동구 중앙로203번길 28",
  },
  {
    number: 3,
    color: "#ff81b9",
    title: "꿈틀",
    desc: "맛집/카페 | 대전 동구 중앙로203번길 5",
  },
  {
    number: 4,
    color: "#ac8f39",
    title: "꿈돌이하우스",
    desc: "관광 | 대전 동구 중앙로203번길 3",
  },
  {
    number: 5,
    color: "#ac8f39",
    title: "대전트래블라운지",
    desc: "관광 | 대전 동구 중앙로 187-1",
  },
  {
    number: 6,
    color: "#ff81b9",
    title: "미들커피",
    desc: "맛집/카페 | 대전 동구 대전로797번길 46",
  },
];

// 예시: 모달에서 받은 구간 정보 props로 받기
export default function AiRecommendDetailScreen({
  setActiveTab,
  setActiveScreen,
  segment = "부산 - 대전",
  waypoints: propWaypoints,
}) {
  // 실제로는 propWaypoints를 받아야 함. 없으면 기존 더미 사용
  const initialWaypoints = useMemo(() => {
    return (
      propWaypoints || [
        {
          number: 1,
          type: "기차역",
          title: "대전역",
          desc: "기차역 | 대전 동구 중앙로 215",
        },
        {
          number: 2,
          type: "맛집/카페",
          title: "김화칼국수",
          desc: "맛집/카페 | 대전 동구 중앙로203번길 28",
        },
        {
          number: 3,
          type: "맛집/카페",
          title: "꿈틀",
          desc: "맛집/카페 | 대전 동구 중앙로203번길 5",
        },
        {
          number: 4,
          type: "관광",
          title: "꿈돌이하우스",
          desc: "관광 | 대전 동구 중앙로203번길 3",
        },
        {
          number: 5,
          type: "관광",
          title: "대전트래블라운지",
          desc: "관광 | 대전 동구 중앙로 187-1",
        },
        {
          number: 6,
          type: "맛집/카페",
          title: "미들커피",
          desc: "맛집/카페 | 대전 동구 대전로797번길 46",
        },
      ]
    );
  }, [propWaypoints]);

  const [isEditing, setIsEditing] = useState(false);
  const [waypointsState, setWaypointsState] = useState(initialWaypoints);
  const scrollRef = useRef(null);

  // ✅ 임시 좌표 (대전역 근처 대략)
  // 실제 서비스에서는 propWaypoints에 latitude/longitude를 같이 내려주는 걸 추천!
  const base = { latitude: 36.3258, longitude: 127.4353 }; // 대전역 근처(대략)

  const waypointsWithCoords = useMemo(() => {
    return waypointsState.map((w, idx) => {
      // 1) 만약 wp에 실제 좌표가 있으면 그걸 사용
      if (w.latitude && w.longitude) {
        return { ...w, latitude: w.latitude, longitude: w.longitude };
      }

      // 2) 없으면 임시로 base 주변에 조금씩 흩뿌려서 마커가 보이게
      const dLat = 0.0012 * idx;
      const dLng = 0.001 * idx;
      return {
        ...w,
        latitude: base.latitude + dLat,
        longitude: base.longitude + dLng,
      };
    });
  }, [waypointsState]);

  const handleBack = () => {
    if (setActiveTab) setActiveTab("travel");
    if (setActiveScreen) setActiveScreen(null);
  };

  const renumber = (list) => list.map((w, idx) => ({ ...w, number: idx + 1 }));

  const handleToggleEdit = () => {
    setIsEditing((v) => {
      const next = !v;
      // if (next) {
      requestAnimationFrame(() => {
        scrollRef.current?.scrollTo({ y: 0, animated: true });
      });
      // }
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
    };

    setWaypointsState((prev) => {
      const next = [...prev];
      next.splice(index + 1, 0, dummy);
      return renumber(next);
    });
  };

  return (
    <View style={screenStyles.container}>
      <ScreenHeader
        title="트레:in(人)"
        showBackButton={true}
        onBackPress={handleBack}
      />
      <View style={styles.container}>
        {/* 지도 영역: 카카오맵 API로 대체 예정 */}
        <View style={styles.mapWrap}>
          <NaverMapView
            style={styles.mapImg}
            initialCamera={{
              latitude: 36.3326,
              longitude: 127.4349,
              zoom: 14,
            }}
            isShowZoomControls={true} // + / - 버튼 (Android)
            isShowCompass={false}
            isShowLocationButton={false}
          />

          <View style={styles.routeSummary}>
            <Image source={imgAvatar} style={styles.avatarSmall} />
            <Text style={styles.routeText}>{segment}</Text>
          </View>
        </View>

        {/* 경유지 리스트 헤더 + 편집 아이콘 */}
        <View style={styles.listHeaderRow}>
          <View style={{ flex: 1 }} />
          <TouchableOpacity style={styles.editBtn} onPress={handleToggleEdit}>
            <MaterialIcons
              name={isEditing ? "check" : "edit"}
              size={22}
              color={isEditing ? "#FF81B9" : Colors.korailGray}
            />
          </TouchableOpacity>
        </View>
        {/* 경유지 카드 + 길찾기 버튼 */}
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

              {/* 카드 사이 파란 + (편집 모드일 때만) */}
              {isEditing && (
                <View style={styles.addRow}>
                  <TouchableOpacity
                    onPress={() => handleAddAfter(idx)}
                    style={styles.addBtn}
                  >
                    <MaterialIcons name="add" size={18} color={Colors.white} />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))}
        </ScrollView>
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
  marker: {
    position: "absolute",
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  markerText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
  detailSection: {
    width: 332,
    flex: 1,
  },
  waypointCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderColor: "#d9d9d9",
    borderWidth: 1,
    borderRadius: 10,
    height: 55,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
    position: "relative",
  },
  waypointTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#2d2d2d",
  },
  waypointDesc: {
    fontSize: 12,
    color: "#77777a",
    fontWeight: "500",
    marginTop: 2,
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
    paddingLeft: 38, // 빨간 '-' 자리 + 간격 맞추기
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
