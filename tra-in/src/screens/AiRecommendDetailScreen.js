import React from "react";
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

export default function AiRecommendDetailScreen({
  setActiveTab,
  setActiveScreen,
}) {
  const handleBack = () => {
    if (setActiveTab) setActiveTab("travel");
    if (setActiveScreen) setActiveScreen(null);
  };

  return (
    <View style={screenStyles.container}>
      <ScreenHeader
        title="트레:in(人)"
        showBackButton={true}
        onBackPress={handleBack}
      />
      <View style={styles.container}>
        {/* 지도 영역 */}
        <View style={styles.mapWrap}>
          <Image
            source={{ uri: imgMap }}
            style={styles.mapImg}
            resizeMode="cover"
          />
          <View style={styles.routeSummary}>
            <Image source={{ uri: imgAvatar }} style={styles.avatarSmall} />
            <Text style={styles.routeText}>부산 - 대전</Text>
          </View>
          {/* 번호 마커들 (예시, 실제 위치는 absolute로 조정 필요) */}
          <View
            style={[
              styles.marker,
              { left: 266, top: 99, backgroundColor: "#005db3" },
            ]}
          >
            <Text style={styles.markerText}>1</Text>
          </View>
          <View
            style={[
              styles.marker,
              { left: 126, top: 53, backgroundColor: "#ff81b9" },
            ]}
          >
            <Text style={styles.markerText}>2</Text>
          </View>
          <View
            style={[
              styles.marker,
              { left: 162, top: 145, backgroundColor: "#ff81b9" },
            ]}
          >
            <Text style={styles.markerText}>3</Text>
          </View>
          <View
            style={[
              styles.marker,
              { left: 174, top: 162, backgroundColor: "#ac8f39" },
            ]}
          >
            <Text style={styles.markerText}>4</Text>
          </View>
          <View
            style={[
              styles.marker,
              { left: 38, top: 209, backgroundColor: "#ac8f39" },
            ]}
          >
            <Text style={styles.markerText}>5</Text>
          </View>
          <View
            style={[
              styles.marker,
              { left: 74, top: 269, backgroundColor: "#ff81b9" },
            ]}
          >
            <Text style={styles.markerText}>6</Text>
          </View>
        </View>
        {/* 세부 일정 섹션 */}
        <ScrollView
          style={styles.detailSection}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          {waypoints.map((wp, idx) => (
            <View key={wp.number} style={styles.waypointCard}>
              <View
                style={[
                  styles.marker,
                  {
                    left: 17,
                    top: 16,
                    backgroundColor: wp.color,
                    position: "absolute",
                  },
                ]}
              >
                <Text style={styles.markerText}>{wp.number}</Text>
              </View>
              <View
                style={{
                  marginLeft: 68,
                  paddingVertical: 6,
                  paddingHorizontal: 10,
                }}
              >
                <Text style={styles.waypointTitle}>{wp.title}</Text>
                <Text style={styles.waypointDesc}>{wp.desc}</Text>
              </View>
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
});
