// src/screens/ReservationDetailScreen.js
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { screenStyles } from "../constants/screenStyles";
import { Colors } from "../constants/theme";
import ScreenHeader from "../components/ScreenHeader";
import BottomNavigation from "../navigation/BottomNavigation";

const ReservationDetailScreen = ({
  setActiveTab,
  setActiveScreen,
  setSearchParams, // ✅ 추가: AiRecommendDetailScreen에 넘길 params setter
  reservation,
}) => {
  const data = reservation;

  const handleTabChange = (newTab) => {
    setActiveScreen(null);
    setActiveTab(newTab);
  };

  const getStationNameFontSize = (stationName) => {
    const length = stationName.length;
    if (length <= 2) return 36;
    if (length === 3) return 36;
    if (length === 4) return 28;
    if (length === 5) return 22;
    return 18;
  };

  // ✅ 구간 AI 추천 이동
  const goAiRecommendForSegment = ({ from, to }) => {
    const userId = data?.userId ?? 1;
    const ticketId = data?.ticketId ?? data?.id ?? null;

    const routeLabel = `${data?.departure ?? ""} - ${data?.arrival ?? ""}`;
    const segment = `${from} - ${to}`;

    const params = {
      userId,
      ticketId,
      destName: to, // ✅ 도착역 기준으로 추천
      travelPreference: "자연", // ✅ 없으면 기본값 (원하면 data에서 받아오게 바꿀 수 있음)
      routeLabel, // ✅ 전체 구간 표시용
      segment, // ✅ 현재 구간 표시용(최우선)
      from,
      to,
    };

    setSearchParams?.(params);
    setActiveTab?.("travel");
    setActiveScreen?.("aiRecommendDetail");
  };

  return (
    <View style={screenStyles.container}>
      <ScreenHeader
        showBackButton={true}
        title="트레:in(人)"
        onBackPress={() => setActiveScreen(null)}
      />

      <ScrollView
        style={screenStyles.content}
        contentContainerStyle={{
          alignItems: "center",
          paddingTop: 24,
          paddingBottom: 100,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.timelineCard}>
          <Text style={styles.date}>{data.date}</Text>

          {/* compute transfers */}
          {(() => {
            const buildFromLegs = (legs = []) => {
              const formatTime = (dt) => (dt ? dt.slice(11, 16) : "");
              const formatDate = (dt) => {
                if (!dt) return "";
                const d = dt.slice(0, 10).replace(/-/g, ".");
                const dayKor = ["일", "월", "화", "수", "목", "금", "토"][
                  new Date(dt).getDay()
                ];
                return `${d}${dayKor ? ` (${dayKor})` : ""}`;
              };
              const out = [];
              for (let i = 0; i < legs.length - 1; i++) {
                const arrivalLeg = legs[i];
                const departureLeg = legs[i + 1];
                out.push({
                  station: arrivalLeg.destStation,
                  arrivalTime: arrivalLeg.arrivalTime
                    ? formatTime(arrivalLeg.arrivalTime)
                    : "",
                  arrivalDate: arrivalLeg.arrivalTime
                    ? formatDate(arrivalLeg.arrivalTime)
                    : "",
                  departureTime:
                    departureLeg && departureLeg.departureTime
                      ? formatTime(departureLeg.departureTime)
                      : "",
                  departureDate:
                    departureLeg && departureLeg.departureTime
                      ? formatDate(departureLeg.departureTime)
                      : "",
                  seat: arrivalLeg.seatCode,
                  carNo: arrivalLeg.carNo,
                });
              }
              return out;
            };

            const normalizeTransfers = (transfers = []) => {
              return transfers.map((t) => {
                const arrivalTime = t.arrivalTime || t.time || "";
                const departureTime = t.departureTime || "";
                const arrivalDate = t.arrivalDate || t.date || data.date || "";
                const departureDate =
                  t.departureDate || t.date || data.date || "";
                let aT = arrivalTime;
                let dT = departureTime;
                if (aT && dT && aT === dT) dT = "";
                return {
                  station: t.station,
                  arrivalTime: aT,
                  arrivalDate,
                  departureTime: dT,
                  departureDate,
                  seat: t.seat || t.seatCode || "",
                  carNo: t.carNo || null,
                };
              });
            };

            const computedTransfers =
              Array.isArray(data.legs) && data.legs.length > 0
                ? buildFromLegs(data.legs)
                : normalizeTransfers(data.transfers || []);

            global.__computedTransfers = computedTransfers;
            return null;
          })()}

          {/* ✅ 구간(역 리스트) 만들기: 출발 -> 경유들 -> 도착 */}
          {(() => {
            const transfers =
              global.__computedTransfers || data.transfers || [];
            const stops = [
              data.departure,
              ...transfers.map((t) => t.station),
              data.arrival,
            ];

            global.__stops = stops;
            return null;
          })()}

          <View style={styles.timelineWrap}>
            {/* 출발지 */}
            <View style={styles.timelineRow}>
              <View style={styles.timelineLeft}>
                <Text
                  style={[
                    styles.stationName,
                    { fontSize: getStationNameFontSize(data.departure) },
                  ]}
                  numberOfLines={1}
                >
                  {data.departure}
                </Text>
                {data.departureTime ? (
                  <>
                    <Text style={[styles.stationTime, { marginTop: 8 }]}>
                      {data.departureTime}
                    </Text>
                    <Text style={styles.stationDate}>
                      {data.departureDate || data.date}
                    </Text>
                  </>
                ) : null}
              </View>
              <View style={styles.timelineRight}>
                <View style={styles.infoCard}>
                  <Text style={styles.infoLabel}>출발지</Text>
                  <Text
                    style={styles.infoValue}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {data.departure}
                  </Text>
                  <TouchableOpacity>
                    <Text style={styles.infoLink}>더 알아보기</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* ✅ 출발 -> 첫 경유(or 도착) 구간 */}
            <View style={styles.segmentContainer}>
              <View style={styles.timelineLine} />
              <View style={styles.seatBadge}>
                <Text style={styles.seatBadgeText}>
                  {data.transfers?.[0]?.carNo && data.transfers?.[0]?.seat
                    ? `${data.transfers[0].carNo}호차 ${data.transfers[0].seat}`
                    : data.seat}
                </Text>
              </View>

              {/* ✅ AI 일정 추천 버튼 (서울->대전이면 대전 추천) */}
              <TouchableOpacity
                style={styles.aiBtn}
                activeOpacity={0.85}
                onPress={() =>
                  goAiRecommendForSegment({
                    from: global.__stops?.[0],
                    to: global.__stops?.[1],
                  })
                }
              >
                <Text style={styles.aiBtnText}>AI 일정 추천</Text>
              </TouchableOpacity>
            </View>

            {/* 경유지들 */}
            {(global.__computedTransfers || data.transfers || []).map(
              (transfer, index) => (
                <React.Fragment key={`${transfer.station}-${index}`}>
                  <View style={styles.timelineRow}>
                    <View style={styles.timelineLeft}>
                      {(() => {
                        const arrivalTime = transfer.arrivalTime || "";
                        const arrivalDate =
                          transfer.arrivalDate ||
                          transfer.date ||
                          data.date ||
                          "";
                        const departureTime = transfer.departureTime || "";
                        const departureDate =
                          transfer.departureDate ||
                          transfer.date ||
                          data.date ||
                          "";
                        return (
                          <>
                            {arrivalTime ? (
                              <>
                                <Text style={styles.stationTime}>
                                  {arrivalTime}
                                </Text>
                                <Text style={styles.stationDate}>
                                  {arrivalDate}
                                </Text>
                              </>
                            ) : null}
                            <Text
                              style={[
                                styles.stationName,
                                {
                                  fontSize: getStationNameFontSize(
                                    transfer.station
                                  ),
                                  marginTop: arrivalTime ? 8 : 0,
                                },
                              ]}
                              numberOfLines={1}
                            >
                              {transfer.station}
                            </Text>
                            {departureTime ? (
                              <>
                                <Text
                                  style={[styles.stationTime, { marginTop: 8 }]}
                                >
                                  {departureTime}
                                </Text>
                                <Text style={styles.stationDate}>
                                  {departureDate}
                                </Text>
                              </>
                            ) : null}
                          </>
                        );
                      })()}
                    </View>
                    <View style={styles.timelineRight}>
                      <View style={styles.infoCard}>
                        <Text style={styles.infoLabel}>경유지</Text>
                        <Text
                          style={styles.infoValue}
                          numberOfLines={1}
                          ellipsizeMode="tail"
                        >
                          {transfer.station}
                        </Text>
                        <TouchableOpacity>
                          <Text style={styles.infoLink}>더 알아보기</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>

                  {/* ✅ 경유지 -> 다음 정차역(다음 경유 or 도착) 구간 + AI 버튼 */}
                  <View style={styles.segmentContainer}>
                    <View style={styles.timelineLine} />
                    <View style={styles.seatBadge}>
                      <Text style={styles.seatBadgeText}>
                        {transfer.carNo && transfer.seat
                          ? `${transfer.carNo}호차 ${transfer.seat}`
                          : transfer.seat}
                      </Text>
                    </View>

                    <TouchableOpacity
                      style={styles.aiBtn}
                      activeOpacity={0.85}
                      onPress={() =>
                        goAiRecommendForSegment({
                          from: global.__stops?.[index + 1],
                          to: global.__stops?.[index + 2],
                        })
                      }
                    >
                      <Text style={styles.aiBtnText}>AI 일정 추천</Text>
                    </TouchableOpacity>
                  </View>
                </React.Fragment>
              )
            )}

            {/* 도착지 */}
            <View style={styles.timelineRow}>
              <View style={styles.timelineLeft}>
                {data.arrivalTime ? (
                  <>
                    <Text style={styles.stationTime}>{data.arrivalTime}</Text>
                    <Text style={styles.stationDate}>
                      {data.arrivalDate || data.date}
                    </Text>
                  </>
                ) : null}
                <Text
                  style={[
                    styles.stationName,
                    {
                      fontSize: getStationNameFontSize(data.arrival),
                      marginTop: data.arrivalTime ? 8 : 0,
                    },
                  ]}
                  numberOfLines={1}
                >
                  {data.arrival}
                </Text>
              </View>
              <View style={styles.timelineRight}>
                <View style={styles.infoCard}>
                  <Text style={styles.infoLabel}>도착지</Text>
                  <Text
                    style={styles.infoValue}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {data.arrival}
                  </Text>
                  <TouchableOpacity>
                    <Text style={styles.infoLink}>더 알아보기</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <BottomNavigation activeTab="profile" setActiveTab={handleTabChange} />
    </View>
  );
};

const styles = StyleSheet.create({
  stationDate: {
    fontSize: 13,
    color: Colors.korailGray,
    textAlign: "center",
    marginTop: 2,
  },
  infoSubValue: {
    fontSize: 15,
    color: Colors.korailGray,
    textAlign: "center",
    marginTop: 2,
    marginBottom: 2,
  },
  timelineCard: {
    backgroundColor: Colors.white,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: Colors.korailSilver,
    width: 332,
    paddingVertical: 24,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    marginBottom: 16,
  },
  date: {
    fontFamily: "Pretendard Variable",
    fontSize: 15,
    color: Colors.korailGray,
    textAlign: "center",
    marginBottom: 24,
  },
  timelineWrap: {
    paddingHorizontal: 4,
  },
  timelineRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  timelineLeft: {
    alignItems: "center",
    minWidth: 100,
  },
  stationName: {
    fontFamily: "Pretendard Variable",
    fontWeight: "700",
    color: Colors.black,
    textAlign: "center",
    marginBottom: 4,
  },
  stationTime: {
    fontFamily: "Pretendard Variable",
    fontSize: 20,
    fontWeight: "700",
    color: Colors.black,
    textAlign: "center",
  },
  timelineRight: {
    alignItems: "center",
    justifyContent: "center",
  },
  infoCard: {
    backgroundColor: "#F3F6FB",
    borderRadius: 16,
    minWidth: 110,
    maxWidth: 130,
    height: 110,
    paddingTop: 16,
    paddingBottom: 16,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoLabel: {
    fontFamily: "Overpass",
    fontSize: 14,
    fontWeight: "700",
    color: "#1E1E22",
    textAlign: "center",
  },
  infoValue: {
    fontFamily: "Pretendard Variable",
    fontSize: 20,
    fontWeight: "700",
    color: Colors.black,
    textAlign: "center",
    flexShrink: 1,
    width: "100%",
  },
  infoLink: {
    fontFamily: "Overpass",
    fontSize: 12,
    fontWeight: "600",
    color: Colors.korailBlue,
    textAlign: "center",
  },

  segmentContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 50,
    marginVertical: 16,
    gap: 12,
    flexWrap: "wrap",
  },
  timelineLine: {
    width: 2,
    height: 50,
    backgroundColor: Colors.korailBlue,
    opacity: 0.3,
  },
  seatBadge: {
    backgroundColor: Colors.korailBlue,
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  seatBadgeText: {
    fontFamily: "Pretendard Variable",
    fontSize: 15,
    fontWeight: "700",
    color: Colors.white,
    textAlign: "center",
  },

  // ✅ AI 버튼 스타일
  aiBtn: {
    backgroundColor: "#FFE5EF",
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  aiBtnText: {
    fontFamily: "Pretendard Variable",
    fontSize: 13,
    fontWeight: "800",
    color: "#FF81B9",
  },
});

export default ReservationDetailScreen;
