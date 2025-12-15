// src/screens/ReservationListScreen.js
import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { screenStyles } from "../constants/screenStyles";
import { Spacing } from "../constants/theme";
import ScreenHeader from "../components/ScreenHeader";
import BottomNavigation from "../navigation/BottomNavigation";
import ReservationCard from "../components/ReservationCard";
import { API_BASE } from "../config/api";

const ReservationListScreen = ({
  setActiveTab,
  setActiveScreen,
  setSelectedReservation,
}) => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ TODO: 실제 로그인 userId로 교체
  const USER_ID = 1;

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `${API_BASE}/user-tickets?userId=${USER_ID}`
        );
        if (!response.ok) throw new Error("서버 응답 오류");
        const data = await response.json();

        console.log("API 응답:", data);
        setReservations(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
        Alert.alert("에러", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchReservations();
  }, []);

  const handleReservationPress = (reservation) => {
    setSelectedReservation(reservation);
    setActiveScreen("reservationDetail");
  };

  return (
    <View style={screenStyles.container}>
      <ScreenHeader
        showBackButton={true}
        onBackPress={() => setActiveTab("profile")}
      />
      {loading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="#005DB3" />
        </View>
      ) : error ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ color: "red" }}>예약 목록을 불러올 수 없습니다.</Text>
        </View>
      ) : (
        <ScrollView
          style={screenStyles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={screenStyles.body}>
            {reservations.length === 0 ? (
              <Text
                style={{ textAlign: "center", color: "#888", marginTop: 40 }}
              >
                예약 내역이 없습니다.
              </Text>
            ) : (
              Object.values(
                reservations.reduce((acc, reservation, idx) => {
                  const ticketId =
                    reservation.ticketId || reservation.ticket_id || idx;
                  if (!acc[ticketId]) acc[ticketId] = { legs: [], ticketId };
                  acc[ticketId].legs = (acc[ticketId].legs || []).concat(
                    reservation.legs || []
                  );
                  return acc;
                }, {})
              ).map((group, groupIdx) => {
                let legs = group.legs || [];
                if (legs.length === 0) return null;

                legs = [...legs].sort((a, b) =>
                  (a.departureTime || "").localeCompare(b.departureTime || "")
                );

                const departure = legs[0].originStation;
                const arrival = legs[legs.length - 1].destStation;

                const departureTime = legs[0].departureTime
                  ? legs[0].departureTime.slice(11, 16)
                  : "";
                const arrivalTime = legs[legs.length - 1].arrivalTime
                  ? legs[legs.length - 1].arrivalTime.slice(11, 16)
                  : "";

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

                const depDate = legs[0].departureTime
                  ? formatDate(legs[0].departureTime)
                  : "";
                const arrDate = legs[legs.length - 1].arrivalTime
                  ? formatDate(legs[legs.length - 1].arrivalTime)
                  : "";

                const formatted = {
                  id: group.ticketId || group.ticket_id || groupIdx,
                  ticketId:
                    group.ticketId || group.ticket_id || group.id || groupIdx, // ✅ 추가
                  userId: USER_ID, // ✅ 추가

                  date: depDate,
                  departure,
                  arrival,
                  departureTime,
                  arrivalTime,
                  departureDate: depDate,
                  arrivalDate: arrDate,
                  seat: legs[legs.length - 1].seatCode,
                  carNo: legs[legs.length - 1].carNo,
                  trainNo: legs[legs.length - 1].trainNo,
                  transfers,
                  legs,
                };

                return (
                  <ReservationCard
                    key={formatted.id}
                    reservation={formatted}
                    onPress={() => handleReservationPress(formatted)}
                  />
                );
              })
            )}
          </View>
        </ScrollView>
      )}
      <BottomNavigation activeTab="profile" setActiveTab={setActiveTab} />
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: Spacing.lg,
  },
});

export default ReservationListScreen;
