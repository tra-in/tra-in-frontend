import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
import { screenStyles } from "../constants/screenStyles";
import { Colors, Spacing } from "../constants/theme";
import ScreenHeader from "../components/ScreenHeader";
import BottomNavigation from "../navigation/BottomNavigation";

const ReservationDetailScreen = ({ setActiveTab, setActiveScreen, reservation }) => {
  const data = reservation;

  const handleTabChange = (newTab) => {
    setActiveScreen(null);
    setActiveTab(newTab);
  };

  // 역 이름 길이에 따른 폰트 크기 계산
  const getStationNameFontSize = (stationName) => {
    const length = stationName.length;
    if (length <= 2) return 36;
    if (length === 3) return 36;
    if (length === 4) return 28;
    if (length === 5) return 22;
    return 18; // 6글자 이상
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
          paddingBottom: 100
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.timelineCard}>
          <Text style={styles.date}>{data.date}</Text>
          {/* compute transfers to render: prefer explicit legs if provided, else normalize existing transfers */}
          {(() => {
            const buildFromLegs = (legs = []) => {
              const formatTime = (dt) => dt ? (dt.slice(11,16)) : "";
              const formatDate = (dt) => {
                if (!dt) return "";
                const d = dt.slice(0,10).replace(/-/g,'.');
                const dayKor = ['일','월','화','수','목','금','토'][new Date(dt).getDay()];
                return `${d}${dayKor ? ` (${dayKor})` : ''}`;
              };
              const out = [];
              for (let i = 0; i < legs.length - 1; i++) {
                const arrivalLeg = legs[i];
                const departureLeg = legs[i+1];
                out.push({
                  station: arrivalLeg.destStation,
                  arrivalTime: arrivalLeg.arrivalTime ? formatTime(arrivalLeg.arrivalTime) : "",
                  arrivalDate: arrivalLeg.arrivalTime ? formatDate(arrivalLeg.arrivalTime) : "",
                  departureTime: departureLeg && departureLeg.departureTime ? formatTime(departureLeg.departureTime) : "",
                  departureDate: departureLeg && departureLeg.departureTime ? formatDate(departureLeg.departureTime) : "",
                  seat: arrivalLeg.seatCode,
                  carNo: arrivalLeg.carNo,
                });
              }
              return out;
            };

            const normalizeTransfers = (transfers = []) => {
              return transfers.map((t, idx) => {
                const arrivalTime = t.arrivalTime || t.time || "";
                const departureTime = t.departureTime || "";
                const arrivalDate = t.arrivalDate || t.date || data.date || "";
                const departureDate = t.departureDate || t.date || data.date || "";
                // avoid showing identical times twice
                let aT = arrivalTime;
                let dT = departureTime;
                if (aT && dT && aT === dT) {
                  // prefer arrival (show above) and hide duplicate departure
                  dT = "";
                }
                return {
                  station: t.station,
                  arrivalTime: aT,
                  arrivalDate: arrivalDate,
                  departureTime: dT,
                  departureDate: departureDate,
                  seat: t.seat || t.seatCode || "",
                  carNo: t.carNo || null,
                };
              });
            };

            const computedTransfers = Array.isArray(data.legs) && data.legs.length > 0
              ? buildFromLegs(data.legs)
              : normalizeTransfers(data.transfers || []);

            // expose computedTransfers to the render by attaching to a local variable via closure
            // we'll use this variable in the map below by referencing `__computedTransfers`
            // eslint-disable-next-line no-underscore-dangle
            global.__computedTransfers = computedTransfers;
            return null;
          })()}
          
          <View style={styles.timelineWrap}>

            {/* 출발지 */}
            <View style={styles.timelineRow}>
              <View style={styles.timelineLeft}>
                {/* no arrival for departure station */}
                <Text
                  style={[
                    styles.stationName,
                    { fontSize: getStationNameFontSize(data.departure) }
                  ]}
                  numberOfLines={1}
                >
                  {data.departure}
                </Text>
                {/* Departure time below station name */}
                {data.departureTime ? (
                  <>
                    <Text style={[styles.stationTime, { marginTop: 8 }]}>{data.departureTime}</Text>
                    <Text style={styles.stationDate}>{data.departureDate || data.date}</Text>
                  </>
                ) : null}
              </View>
              <View style={styles.timelineRight}>
                <View style={styles.infoCard}>
                  <Text style={styles.infoLabel}>출발지</Text>
                  <Text style={styles.infoValue} numberOfLines={1} ellipsizeMode="tail">
                    {data.departure}
                  </Text>
                  {/* 좌석 정보 */}
                  {data.departureCarNo && data.departureSeat && (
                    <Text style={styles.infoSubValue}>{`${data.departureCarNo}호차 ${data.departureSeat}`}</Text>
                  )}
                  <TouchableOpacity>
                    <Text style={styles.infoLink}>더 알아보기</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* 출발-1경유 구간: 항상 호차 좌석 출력 */}
            <View style={styles.segmentContainer}>
              <View style={styles.timelineLine} />
              <View style={styles.seatBadge}>
                <Text style={styles.seatBadgeText}>
                  {data.departureCarNo && data.departureSeat
                    ? `${data.departureCarNo}호차 ${data.departureSeat}`
                    : (data.transfers[0] && data.transfers[0].carNo && data.transfers[0].seat
                        ? `${data.transfers[0].carNo}호차 ${data.transfers[0].seat}`
                        : data.seat)}
                </Text>
              </View>
            </View>

            {/* 경유지들 */}
            {(global.__computedTransfers || data.transfers || []).map((transfer, index) => (
              <React.Fragment key={`${transfer.station}-${index}`}>
                <View style={styles.timelineRow}>
                  <View style={styles.timelineLeft}>
                    {(() => {
                      // Prefer explicit arrivalTime/departureTime produced by the formatter.
                      // Avoid falling back to legacy `time` which can cause duplicate values.
                      const arrivalTime = transfer.arrivalTime || "";
                      const arrivalDate = transfer.arrivalDate || transfer.date || data.date || "";
                      const departureTime = transfer.departureTime || "";
                      const departureDate = transfer.departureDate || transfer.date || data.date || "";
                      return (
                        <>
                          {arrivalTime ? (
                            <>
                              <Text style={styles.stationTime}>{arrivalTime}</Text>
                              <Text style={styles.stationDate}>{arrivalDate}</Text>
                            </>
                          ) : null}
                          <Text
                            style={[
                              styles.stationName,
                              { fontSize: getStationNameFontSize(transfer.station), marginTop: arrivalTime ? 8 : 0 }
                            ]}
                            numberOfLines={1}
                          >
                            {transfer.station}
                          </Text>
                          {departureTime ? (
                            <>
                              <Text style={[styles.stationTime, { marginTop: 8 }]}>{departureTime}</Text>
                              <Text style={styles.stationDate}>{departureDate}</Text>
                            </>
                          ) : null}
                        </>
                      );
                    })()}
                  </View>
                  <View style={styles.timelineRight}>
                    <View style={styles.infoCard}>
                      <Text style={styles.infoLabel}>경유지</Text>
                      <Text style={styles.infoValue} numberOfLines={1} ellipsizeMode="tail">
                        {transfer.station}
                      </Text>
                      {/* 경유지 infoCard에는 좌석 정보 출력 안함 */}
                      <TouchableOpacity>
                        <Text style={styles.infoLink}>더 알아보기</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>

                <View style={styles.segmentContainer}>
                  <View style={styles.timelineLine} />
                  <View style={styles.seatBadge}>
                    <Text style={styles.seatBadgeText}>{transfer.carNo && transfer.seat ? `${transfer.carNo}호차 ${transfer.seat}` : transfer.seat}</Text>
                  </View>
                </View>
              </React.Fragment>
            ))}

            {/* 도착지 */}
            <View style={styles.timelineRow}>
              <View style={styles.timelineLeft}>
                {/* Arrival time above station name */}
                {data.arrivalTime ? (
                  <>
                    <Text style={styles.stationTime}>{data.arrivalTime}</Text>
                    <Text style={styles.stationDate}>{data.arrivalDate || data.date}</Text>
                  </>
                ) : null}
                <Text
                  style={[
                    styles.stationName,
                    { fontSize: getStationNameFontSize(data.arrival), marginTop: data.arrivalTime ? 8 : 0 }
                  ]}
                  numberOfLines={1}
                >
                  {data.arrival}
                </Text>
                {/* no departure for final station */}
              </View>
              <View style={styles.timelineRight}>
                <View style={styles.infoCard}>
                  <Text style={styles.infoLabel}>도착지</Text>
                  <Text style={styles.infoValue} numberOfLines={1} ellipsizeMode="tail">
                    {data.arrival}
                  </Text>
                  {/* 좌석 정보 */}
                  {data.arrivalCarNo && data.arrivalSeat && (
                    <Text style={styles.infoSubValue}>{`${data.arrivalCarNo}호차 ${data.arrivalSeat}`}</Text>
                  )}
                  <TouchableOpacity>
                    <Text style={styles.infoLink}>더 알아보기</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      <BottomNavigation 
        activeTab="profile" 
        setActiveTab={handleTabChange}
      />
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
  debugBox: {
    marginVertical: 8,
    paddingHorizontal: 8,
  },
  debugText: {
    fontSize: 12,
    color: Colors.korailGray,
    textAlign: 'left',
    marginBottom: 2,
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
    width: '100%',
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
    gap: 16,
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
});

export default ReservationDetailScreen;