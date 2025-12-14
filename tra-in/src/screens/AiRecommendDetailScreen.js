import React, { useMemo, useState, useRef } from "react";
import {View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Dimensions,} from "react-native";
import ScreenHeader from "../components/ScreenHeader";
import { screenStyles } from "../constants/screenStyles";
import WaypointCard from "../components/WaypointCard";
import WaypointActionButton from "../components/WaypointActionButton";
import { Colors } from "../constants/theme";
import { MaterialIcons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const imgMap =
  "http://10.0.2.2:3845/assets/90056faaae1ae1bcd98748385e95216bdab7d280.png";
const imgAvatar =
  "http://10.0.2.2:3845/assets/99ba85abef9eddd1cd0b4dc6a23df8c8c7d2afc3.png";
const imgAvatar1 =
  "http://10.0.2.2:3845/assets/1b5860a0f6bb3a218b4940d0f285a1ed9260ca16.png";
const imgVector196 =
  "http://10.0.2.2:3845/assets/18d23bf28d617b0fc339c85ffa337e5900f9f636.svg";
const imgVector194 =
  "http://10.0.2.2:3845/assets/f1b691c08b17ade4fd91121a00f1cd3ab9475629.svg";
const imgVector195 =
  "http://10.0.2.2:3845/assets/d516cc6e8e4b482ab1288dfa6c8ffad85f459764.svg";
const imgVector197 =
  "http://10.0.2.2:3845/assets/d49f5806fbb3efccf83a706dac82a6ab3676cc3b.svg";
const imgVector198 =
  "http://10.0.2.2:3845/assets/de475983ff7d638b8ddf4297e35abb3c2c2bd45d.svg";
const imgVector193 =
  "http://10.0.2.2:3845/assets/7031eb115ae2ee7241c64d397a534e5ca0559aa7.svg";
const imgRectangle392 =
  "http://10.0.2.2:3845/assets/39b7b2f2d4cd7ef4ecb1431e72ccd406333c1075.svg";

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
          {/* TODO: 카카오맵 뷰로 교체 */}
          <View
            style={[
              styles.mapImg,
              {
                backgroundColor: Colors.korailSilver,
                justifyContent: "center",
                alignItems: "center",
              },
            ]}
          >
            <Text style={{ color: Colors.korailGray }}>[카카오맵 영역]</Text>
          </View>
          <View style={styles.routeSummary}>
            <Image source={{ uri: imgAvatar }} style={styles.avatarSmall} />
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
