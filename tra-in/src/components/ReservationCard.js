import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Colors, Typography, Spacing, BorderRadius } from "../constants/theme";

const ReservationCard = ({ reservation, onPress, compact = false, allSeats = [] }) => {
  // 모든 좌석 정보를 배열로 구성
  const transfers = Array.isArray(reservation.transfers) ? reservation.transfers : [];
  let seatList;
  if (compact) {
    // compact 모드: allSeats prop이 있으면 사용, 없으면 fallback
    const baseSeats = Array.isArray(allSeats) && allSeats.length > 0
      ? allSeats
      : [
          (reservation.carNo !== undefined && reservation.seat) ? `${reservation.carNo}호차 ${reservation.seat}` : reservation.seat,
          ...transfers.map(t => (t.carNo !== undefined && t.seat ? `${t.carNo}호차 ${t.seat}` : t.seat))
        ].filter(Boolean);
    // 항상 1-8D 형식으로 변환
    seatList = baseSeats.map(s => {
      const match = typeof s === 'string' && s.match(/(\d+)호차\s*([A-Z0-9]+)/i);
      if (match) return `${match[1]}-${match[2]}`;
      return s;
    });
  } else {
    // 일반 목록: 호차+좌석(1호차 8D) 형식, 줄바꿈
    seatList = [
      (reservation.carNo !== undefined && reservation.seat) ? `${reservation.carNo}호차 ${reservation.seat}` : reservation.seat,
      ...transfers.map(t => (t.carNo !== undefined && t.seat ? `${t.carNo}호차 ${t.seat}` : t.seat))
    ].filter(Boolean);
  }

  return (
    <TouchableOpacity
      style={[styles.card, compact && styles.cardCompact]}
      activeOpacity={0.8}
      onPress={onPress}
    >
      {/* 날짜 */}
      <Text style={[styles.date, compact && styles.dateCompact]}>{reservation.date}</Text>

      {/* 출발지와 도착지 */}
      <View style={styles.routeContainer}>
        <View style={styles.stationContainer}>
          <Text style={[styles.stationName, compact && styles.stationNameCompact]}>{reservation.departure}</Text>
          <Text style={[styles.time, compact && styles.timeCompact]}>{reservation.departureTime}</Text>
        </View>

        {/* 화살표와 좌석 */}
        <View style={styles.arrowContainer}>
          {/* 좌석 정보 (화살표 위) - 모든 좌석 */}
          {seatList.length > 0 && (
            <Text style={styles.seats}>
              {seatList.join("\n")}
            </Text>
          )}
          {/* 화살표 */}
          <Text style={styles.arrow}>→</Text>
        </View>

        <View style={styles.stationContainer}>
          <Text style={[styles.stationName, compact && styles.stationNameCompact]}>{reservation.arrival}</Text>
          <Text style={[styles.time, compact && styles.timeCompact]}>{reservation.arrivalTime}</Text>
        </View>
      </View>

      {/* 자세히 버튼 (View로 변경, 터치 이벤트 없음) */}
      <View style={styles.detailButton}>
        <Text style={styles.detailText}>자세히 ›</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 30,
    height: 180,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: "#F4F4F4",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    paddingHorizontal: Spacing.lg,
    paddingTop: 10,
    position: "relative",
  },
  date: {
    fontFamily: "Pretendard Variable",
    fontSize: 15,
    color: Colors.korailGray,
    textAlign: "center",
    marginBottom: 8,
  },
  routeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  stationContainer: {
    alignItems: "center",
    flex: 1,
  },
  stationName: {
    fontFamily: "Pretendard Variable",
    fontSize: 36,
    fontWeight: "700",
    color: Colors.black,
    marginBottom: 4,
  },
  time: {
    fontFamily: "Pretendard Variable",
    fontSize: 20,
    fontWeight: "700",
    color: Colors.black,
  },
  /* compact variants */
  cardCompact: {
    height: 140,
    paddingHorizontal: Spacing.md,
    paddingTop: 8,
    borderRadius: 14,
  },
  dateCompact: {
    fontSize: 12,
    marginBottom: 6,
  },
  stationNameCompact: {
    fontSize: 20,
  },
  timeCompact: {
    fontSize: 14,
  },
  arrowContainer: {
    width: 80,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  seats: {
    fontFamily: "Pretendard Variable",
    fontSize: 15,
    fontWeight: "700",
    color: Colors.korailGray,
    textAlign: "center",
    marginTop: 8,
  },
  arrow: {
    color: Colors.white
  },
  detailButton: {
    position: "absolute",
    bottom: 16,
    alignSelf: "center",
  },
  detailText: {
    fontFamily: "Pretendard Variable",
    fontSize: 14,
    fontWeight: "400",
    color: Colors.black,
    textAlign: "center",
  },
});

export default ReservationCard;