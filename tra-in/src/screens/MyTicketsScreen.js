import React from "react";
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { screenStyles } from "../constants/screenStyles";
import { Colors, Spacing } from "../constants/theme";
import ReservationCard from "../components/ReservationCard";
import BadgeCard from "../components/BadgeCard";
// import { dummyReservations as DUMMY_RESERVATIONS } from "../data/dummyReservations";
import { generateDummyBadges } from "../data/dummyBadges";
import ScreenHeader from "../components/ScreenHeader";
import BottomNavigation from "../navigation/BottomNavigation";
import { API_BASE } from "../config/api";

const DUMMY_BADGES = generateDummyBadges();

const MyTicketsScreen = ({
  setActiveTab,
  setActiveScreen,
  setSelectedReservation,
  setSelectedBadge,
}) => {
  const handleTabChange = (newTab) => {
    if (setActiveScreen) setActiveScreen(null);
    setActiveTab(newTab);
  };

  const [reservations, setReservations] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchReservations = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${API_BASE}/user-tickets?userId=1`);
        if (!response.ok) throw new Error("서버 응답 오류");
        const data = await response.json();
        setReservations(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchReservations();
  }, []);

  return (
    <View style={screenStyles.container} edges={[]}>
      <ScreenHeader />

      <ScrollView
        style={screenStyles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <View style={screenStyles.body}>
          {/* Profile header */}
          <View style={styles.profileHeader}>
            <View style={styles.avatar} />
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>홍길동</Text>
              <Text style={styles.profilePoint}>포인트 1,200</Text>
            </View>
          </View>

          {/* Quick action buttons */}
          <View style={styles.quickActionsRow}>
            <TouchableOpacity
              style={styles.quickAction}
              activeOpacity={0.8}
              onPress={() => {
                if (setActiveScreen) setActiveScreen(null);
                setActiveTab("reservationList");
              }}
            >
              <Text style={styles.quickActionText}>예약</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickAction}
              activeOpacity={0.8}
              onPress={() => {
                if (setActiveScreen) setActiveScreen(null);
                setActiveTab("badgeList");
              }}
            >
              <Text style={styles.quickActionText}>뱃지</Text>
            </TouchableOpacity>
          </View>

          {/* Recent reservations */}
          <View style={styles.sectionHeaderRow}>
            <TouchableOpacity
              style={styles.sectionHeaderTouchable}
              activeOpacity={0.7}
              onPress={() => {
                if (setActiveTab) setActiveTab("reservationList");
                if (setActiveScreen) setActiveScreen(null);
              }}
            >
              <Text style={[styles.sectionTitle, styles.sectionTitleNoMargin]}>
                최근 예약
              </Text>
              <Text style={styles.sectionActionIcon}>›</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: 4, paddingRight: 12 }}
          >
            {(() => {
              if (loading) return <Text style={{ margin: 16 }}>로딩중...</Text>;
              if (error)
                return (
                  <Text style={{ margin: 16, color: "red" }}>
                    에러: {error}
                  </Text>
                );
              // ticket_id로 묶어서 최근 예약 4개만 보여줌
              return Object.values(
                reservations.reduce((acc, reservation, idx) => {
                  const ticketId =
                    reservation.ticketId || reservation.ticket_id || idx;
                  if (!acc[ticketId])
                    acc[ticketId] = { ...reservation, legs: [] };
                  acc[ticketId].legs = (acc[ticketId].legs || []).concat(
                    reservation.legs || []
                  );
                  return acc;
                }, {})
              )
                .slice(0, 4)
                .map((group, groupIdx) => {
                  let legs = group.legs || [];
                  if (legs.length === 0) return null;
                  // legs를 출발시간 기준으로 정렬 (출발→도착 순서 보장)
                  legs = [...legs].sort((a, b) => {
                    const at = a.departureTime || "";
                    const bt = b.departureTime || "";
                    return at.localeCompare(bt);
                  });
                  // 출발: 첫 leg의 originStation, 도착: 마지막 leg의 destStation, 경유: 중간 leg들의 destStation(중복 제거)
                  const first = legs[0];
                  const last = legs[legs.length - 1];
                  // 경유지: 중간 leg들의 destStation, 중복 제거
                  const transferStations = legs
                    .slice(0, -1)
                    .map((l) => l.destStation)
                    .filter(
                      (station, idx, arr) =>
                        arr.indexOf(station) === idx &&
                        station !== last.destStation
                    );
                  const transfers = [];
                  const formatTime = (dt) => (dt ? dt.slice(11, 16) : "");
                  const formatDate = (dt) => {
                    if (!dt) return "";
                    const d = dt.slice(0, 10).replace(/-/g, ".");
                    const dayKor = ["일", "월", "화", "수", "목", "금", "토"][
                      new Date(dt).getDay()
                    ];
                    return `${d}${dayKor ? ` (${dayKor})` : ""}`;
                  };
                  for (let i = 0; i < legs.length - 1; i++) {
                    const arrivalLeg = legs[i];
                    const station = arrivalLeg.destStation;
                    const departureLeg = legs[i + 1];
                    transfers.push({
                      station,
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
                  const depDate = first.departureTime
                    ? formatDate(first.departureTime)
                    : "";
                  const arrDate = last.arrivalTime
                    ? formatDate(last.arrivalTime)
                    : "";
                  // 좌석 정보: 모든 구간을 '호차 좌석' 형식(1호차 4B)으로 줄바꿈
                  const allSeats = legs
                    .map((l) =>
                      l.carNo !== undefined && l.seatCode
                        ? `${l.carNo}호차 ${l.seatCode}`
                        : l.seatCode
                    )
                    .filter(Boolean);
                  const formatted = {
                    id: group.ticketId || group.ticket_id || groupIdx,
                    date: depDate,
                    departure: first.originStation,
                    arrival: last.destStation,
                    departureTime: first.departureTime
                      ? first.departureTime.slice(11, 16)
                      : "",
                    arrivalTime: last.arrivalTime
                      ? last.arrivalTime.slice(11, 16)
                      : "",
                    departureDate: depDate,
                    arrivalDate: arrDate,
                    seat: last.seatCode,
                    carNo: last.carNo,
                    trainNo: last.trainNo,
                    transfers,
                    legs,
                    allSeats, // compact 모드에서 사용
                  };
                  return (
                    <View key={formatted.id} style={styles.recentResWrapper}>
                      <ReservationCard
                        reservation={formatted}
                        compact
                        allSeats={allSeats}
                        onPress={() => {
                          if (setSelectedReservation)
                            setSelectedReservation(formatted);
                          if (setActiveScreen)
                            setActiveScreen("reservationDetail");
                        }}
                      />
                    </View>
                  );
                });
            })()}
          </ScrollView>

          {/* Completed badges */}
          <View style={styles.sectionHeaderRow}>
            <TouchableOpacity
              style={styles.sectionHeaderTouchable}
              activeOpacity={0.7}
              onPress={() => {
                if (setActiveTab) setActiveTab("badgeList");
                if (setActiveScreen) setActiveScreen(null);
              }}
            >
              <Text style={[styles.sectionTitle, styles.sectionTitleNoMargin]}>
                완료된 뱃지
              </Text>
              <Text style={styles.sectionActionIcon}>›</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: 8, paddingRight: 12 }}
          >
            {DUMMY_BADGES.filter((b) => b.status === "completed")
              .slice(0, 6)
              .map((b) => (
                <View key={b.id} style={styles.badgeItemWrapper}>
                  <BadgeCard
                    badge={b}
                    compact
                    onPress={() => {
                      if (setSelectedBadge) setSelectedBadge(b);
                      if (setActiveScreen) setActiveScreen("badgeDetail");
                    }}
                  />
                </View>
              ))}
          </ScrollView>

          {/* Not completed badges */}
          <View style={styles.sectionHeaderRow}>
            <TouchableOpacity
              style={styles.sectionHeaderTouchable}
              activeOpacity={0.7}
              onPress={() => {
                if (setActiveTab) setActiveTab("badgeList");
                if (setActiveScreen) setActiveScreen(null);
              }}
            >
              <Text style={[styles.sectionTitle, styles.sectionTitleNoMargin]}>
                미완료 뱃지
              </Text>
              <Text style={styles.sectionActionIcon}>›</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: 8, paddingRight: 12 }}
          >
            {DUMMY_BADGES.filter((b) => b.status !== "completed")
              .slice(0, 12)
              .map((b) => (
                <View key={b.id} style={styles.badgeItemWrapper}>
                  <BadgeCard
                    badge={b}
                    compact
                    onPress={() => {
                      if (setSelectedBadge) setSelectedBadge(b);
                      if (setActiveScreen) setActiveScreen("badgeDetail");
                    }}
                  />
                </View>
              ))}
          </ScrollView>
        </View>
      </ScrollView>

      <BottomNavigation activeTab="profile" setActiveTab={handleTabChange} />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 30,
    height: 180,
    marginBottom: Spacing.md,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F4F4F4",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  cardTitle: {
    fontFamily: "Overpass",
    fontSize: 30,
    fontWeight: "600",
    color: Colors.black,
    textAlign: "center",
  },
  profileHeader: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#E6EEF8",
    marginRight: 14,
  },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 20, fontWeight: "700", color: Colors.black },
  profilePoint: { marginTop: 6, color: "#4B5563" },
  quickActionsRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  quickAction: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 18,
    paddingVertical: 18,
    marginHorizontal: 6,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  quickActionText: { fontSize: 16, fontWeight: "700", color: Colors.black },
  sectionHeaderRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 8,
  },
  sectionActionIcon: {
    fontSize: 28,
    color: Colors.black,
    lineHeight: 28,
    marginLeft: 8,
  },
  sectionTitleNoMargin: { marginBottom: 0 },
  sectionHeaderTouchable: { flexDirection: "row", alignItems: "center" },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.black,
    marginBottom: 8,
  },
  recentResWrapper: { width: 260, marginRight: 12 },
  badgeItemWrapper: { width: 172, marginRight: 12 },
});

export default MyTicketsScreen;
