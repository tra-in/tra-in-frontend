import React, { useEffect, useState } from "react";
import {Text, View, ScrollView, StyleSheet, ActivityIndicator, Alert} from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
import { screenStyles } from "../constants/screenStyles";
import { Spacing } from "../constants/theme";
import ScreenHeader from "../components/ScreenHeader";
import BottomNavigation from "../navigation/BottomNavigation";
import ReservationCard from "../components/ReservationCard";
// import { dummyReservations } from "../data/dummyReservations";

const ReservationListScreen = ({ setActiveTab, setActiveScreen, setSelectedReservation }) => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setLoading(true);
        setError(null);
        // userId는 실제 로그인 정보에서 받아와야 함. 임시로 1로 고정
        const response = await fetch("http://192.168.10.39:8080/api/user-tickets?userId=1");
        if (!response.ok) throw new Error("서버 응답 오류");
        const data = await response.json();
        console.log('API 응답:', data);
        if (!Array.isArray(data)) {
          console.error('API 응답이 배열이 아님:', data);
        }
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

  console.log('reservations state:', reservations);
  return (
    <View style={screenStyles.container}>
      <ScreenHeader
        showBackButton={true}
        onBackPress={() => setActiveTab("profile")}
      />
      {loading ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color="#005DB3" />
        </View>
      ) : error ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
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
              <Text style={{ textAlign: "center", color: "#888", marginTop: 40 }}>예약 내역이 없습니다.</Text>
            ) : (
              // ticketId(혹은 ticket_id)가 같은 예약을 하나의 카드로 묶어서, legs 전체를 transfers로 넘김
              Object.values(
                reservations.reduce((acc, reservation, idx) => {
                  // ticketId 또는 ticket_id로 그룹화
                  const ticketId = reservation.ticketId || reservation.ticket_id || idx;
                  if (!acc[ticketId]) acc[ticketId] = { legs: [] };
                  acc[ticketId].legs = (acc[ticketId].legs || []).concat(reservation.legs || []);
                  return acc;
                }, {})
              ).map((group, groupIdx) => {
                let legs = group.legs || [];
                if (legs.length === 0) return null;
                // legs를 출발시간 기준으로 정렬 (출발→도착 순서 보장)
                legs = [...legs].sort((a, b) => (a.departureTime || '').localeCompare(b.departureTime || ''));
                // 출발역: legs[0].originStation, 도착역: legs[n-1].destStation, 경유지: legs[0~n-2].destStation(중복 없이, 순서대로)
                const departure = legs[0].originStation;
                const arrival = legs[legs.length - 1].destStation;
                const departureTime = legs[0].departureTime ? legs[0].departureTime.slice(11, 16) : '';
                const arrivalTime = legs[legs.length - 1].arrivalTime ? legs[legs.length - 1].arrivalTime.slice(11, 16) : '';
                // 경유지: legs[0~n-2].destStation, 중복 없이, 순서대로
                const transfers = [];
                const formatTime = (dt) => dt ? dt.slice(11,16) : "";
                const formatDate = (dt) => {
                  if (!dt) return "";
                  const d = dt.slice(0,10).replace(/-/g, ".");
                  const dayKor = ["일","월","화","수","목","금","토"][new Date(dt).getDay()];
                  return `${d}${dayKor ? ` (${dayKor})` : ""}`;
                };
                for (let i = 0; i < legs.length - 1; i++) {
                  const arrivalLeg = legs[i];
                  const station = arrivalLeg.destStation;
                  const departureLeg = legs[i+1];
                  transfers.push({
                    station,
                    arrivalTime: arrivalLeg.arrivalTime ? formatTime(arrivalLeg.arrivalTime) : "",
                    arrivalDate: arrivalLeg.arrivalTime ? formatDate(arrivalLeg.arrivalTime) : "",
                    departureTime: departureLeg && departureLeg.departureTime ? formatTime(departureLeg.departureTime) : "",
                    departureDate: departureLeg && departureLeg.departureTime ? formatDate(departureLeg.departureTime) : "",
                    seat: arrivalLeg.seatCode,
                    carNo: arrivalLeg.carNo,
                  });
                }
                const depDate = legs[0].departureTime ? formatDate(legs[0].departureTime) : "";
                const arrDate = legs[legs.length - 1].arrivalTime ? formatDate(legs[legs.length - 1].arrivalTime) : "";
                const formatted = {
                  id: group.ticketId || group.ticket_id || groupIdx,
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
