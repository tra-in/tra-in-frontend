import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { screenStyles } from "../constants/screenStyles";
import { Colors, Spacing } from "../constants/theme";
import ScreenHeader from "../components/ScreenHeader";
import BottomNavigation from "../navigation/BottomNavigation";

const ReservationDetailScreen = ({ setActiveTab, setActiveScreen, reservation }) => {
  const dummy = {
    date: "2025.12.15 (월)",
    departure: "부산",
    arrival: "대전",
    departureTime: "06:34",
    arrivalTime: "08:16",
    seat: "A3",
    transfers: [
      { station: "김천구미", time: "07:55", seat: "C5" },
    ],
  };
  const data = reservation || dummy;

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
    <SafeAreaView style={screenStyles.container}>
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
          
          <View style={styles.timelineWrap}>
            {/* 출발지 */}
            <View style={styles.timelineRow}>
              <View style={styles.timelineLeft}>
                <Text
                style={[
                    styles.stationName,
                    { fontSize: getStationNameFontSize(data.departure) }
                ]}
                numberOfLines={1}
                >
                {data.departure}
                </Text>
                <Text style={styles.stationTime}>{data.departureTime}</Text>
              </View>
              <View style={styles.timelineRight}>
                <View style={styles.infoCard}>
                  <Text style={styles.infoLabel}>출발지</Text>
                  <Text style={styles.infoValue} numberOfLines={1} ellipsizeMode="tail">
                    {data.departure}
                  </Text>
                  <TouchableOpacity>
                    <Text style={styles.infoLink}>더 알아보기</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* 출발 구간 */}
            <View style={styles.segmentContainer}>
              <View style={styles.timelineLine} />
              <View style={styles.seatBadge}>
                <Text style={styles.seatBadgeText}>{data.seat}</Text>
              </View>
            </View>

            {/* 경유지들 */}
            {data.transfers.map((transfer, index) => (
              <React.Fragment key={`${transfer.station}-${index}`}>
                <View style={styles.timelineRow}>
                  <View style={styles.timelineLeft}>
                    <Text
                    style={[
                        styles.stationName,
                        { fontSize: getStationNameFontSize(transfer.station) }
                    ]}
                    numberOfLines={1}
                    >
                    {transfer.station}
                    </Text>
                    <Text style={styles.stationTime}>{transfer.time}</Text>
                  </View>
                  <View style={styles.timelineRight}>
                    <View style={styles.infoCard}>
                      <Text style={styles.infoLabel}>경유지</Text>
                      <Text style={styles.infoValue} numberOfLines={1} ellipsizeMode="tail">
                        {transfer.station}
                      </Text>
                      <TouchableOpacity>
                        <Text style={styles.infoLink}>더 알아보기</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>

                <View style={styles.segmentContainer}>
                  <View style={styles.timelineLine} />
                  <View style={styles.seatBadge}>
                    <Text style={styles.seatBadgeText}>{transfer.seat}</Text>
                  </View>
                </View>
              </React.Fragment>
            ))}

            {/* 도착지 */}
            <View style={styles.timelineRow}>
              <View style={styles.timelineLeft}>
                <Text
                style={[
                    styles.stationName,
                    { fontSize: getStationNameFontSize(data.arrival) }
                ]}
                numberOfLines={1}
                >
                {data.arrival}
                </Text>
                <Text style={styles.stationTime}>{data.arrivalTime}</Text>
              </View>
              <View style={styles.timelineRight}>
                <View style={styles.infoCard}>
                  <Text style={styles.infoLabel}>도착지</Text>
                  <Text style={styles.infoValue} numberOfLines={1} ellipsizeMode="tail">
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
      <BottomNavigation 
        activeTab="profile" 
        setActiveTab={handleTabChange}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
    marginVertical: 8,
    gap: 12,
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