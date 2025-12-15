import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { formatMonthDay } from "../utils/booking";

export default function BookingSummary({
  mode,
  date,
  passengers,
  legs,
  selectedTrains,
  selectedSeats,
  onRetry,
  onReserve,
  onGoHome,
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {mode === "direct" ? "여행 요약 (직행)" : "여행 요약 (메뚜기)"}
      </Text>
      <Text>날짜: {date}</Text>
      <Text>인원: 어른 {passengers}명</Text>

      {legs.map((leg, idx) => {
        const train = selectedTrains[idx];
        const seat = selectedSeats[idx];
        if (!train || !seat) return null;
        return (
          <View key={idx} style={styles.legSection}>
            <Text style={styles.sectionTitle}>
              구간 {idx + 1}: {leg.from} → {leg.to}
            </Text>
            <Text>
              {train.trainType} {train.trainNo}
            </Text>
            <Text>
              시간: {train.departureTime.slice(11, 16)} →{" "}
              {train.arrivalTime.slice(11, 16)} (
              {formatMonthDay(train.departureTime)})
            </Text>
            <Text>
              좌석: {seat.carNo}호차 {seat.seatCode}
            </Text>
          </View>
        );
      })}

      <View style={styles.buttonGroup}>
        <Button title="다시 예매하기" onPress={onRetry} />
        <View style={styles.buttonSpacer} />
        <Button title="예매하기" onPress={onReserve} />
        <View style={styles.buttonSpacer} />
        <Button title="홈으로" onPress={onGoHome} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
    paddingHorizontal: 24,
  },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 8 },
  legSection: { marginTop: 16 },
  sectionTitle: { fontSize: 16, fontWeight: "600" },
  buttonGroup: { marginTop: 32 },
  buttonSpacer: { height: 8 },
});
