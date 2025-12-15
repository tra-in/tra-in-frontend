import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Button,
} from "react-native";
import { API_BASE } from "../config/api";

export default function SeatSelect({ legTitle, train, date, onConfirm }) {
  const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [seats, setSeats] = useState([]);
  const [loadingSeats, setLoadingSeats] = useState(false);
  const [selectedSeatCode, setSelectedSeatCode] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/trains/${train.id}/cars`)
      .then((res) => res.json())
      .then((data) => {
        setCars(data);
        if (data.length > 0) {
          loadSeatsForCar(data[0]);
        }
      })
      .catch((e) => console.error("cars error", e));
  }, [train.id]);

  const loadSeatsForCar = (car) => {
    setSelectedCar(car);
    setSelectedSeatCode(null);
    setLoadingSeats(true);
    fetch(`${API_BASE}/cars/${car.id}/seats`)
      .then((res) => res.json())
      .then((data) => {
        setSeats(data);
        setLoadingSeats(false);
      })
      .catch((e) => {
        console.error("seats error", e);
        setLoadingSeats(false);
      });
  };

  const seatRows = useMemo(() => {
    const map = {};
    seats.forEach((s) => {
      if (!map[s.rowNo]) map[s.rowNo] = [];
      map[s.rowNo].push(s);
    });
    return Object.keys(map)
      .sort((a, b) => Number(a) - Number(b))
      .map((rowKey) => ({
        row: Number(rowKey),
        seats: map[rowKey].sort((a, b) => a.col.localeCompare(b.col)),
      }));
  }, [seats]);

  const handleSeatPress = (seat) => {
    if (seat.status === "SOLD") return;
    setSelectedSeatCode(seat.seatCode);
  };

  const handleConfirm = () => {
    if (!selectedCar || !selectedSeatCode) return;
    onConfirm({
      carId: selectedCar.id,
      carNo: selectedCar.carNo,
      seatCode: selectedSeatCode,
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.stepTitle}>{legTitle}</Text>
      <Text style={styles.trainInfo}>
        {train.origin} → {train.dest} | {date}
      </Text>
      <Text style={styles.trainInfo}>
        {train.trainType} {train.trainNo} | {train.departureTime.slice(11, 16)}{" "}
        → {train.arrivalTime.slice(11, 16)}
      </Text>

      <View style={styles.carTabRow}>
        {cars.map((car) => {
          const active = selectedCar && car.id === selectedCar.id;
          return (
            <Pressable
              key={car.id}
              style={[styles.carTab, active && styles.carTabActive]}
              onPress={() => loadSeatsForCar(car)}
            >
              <Text style={active && { color: "#0A84FF", fontWeight: "bold" }}>
                {car.carNo}호차
              </Text>
            </Pressable>
          );
        })}
      </View>

      {loadingSeats ? (
        <View style={styles.center}>
          <ActivityIndicator />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.seatScroll}>
          {seatRows.map((row) => (
            <View key={row.row} style={styles.seatRow}>
              {row.seats.map((seat) => {
                const isSelected = selectedSeatCode === seat.seatCode;
                let backgroundColor = "#ffffff";
                let borderWidth = 0;
                let borderColor = "transparent";

                if (seat.status === "SOLD") {
                  backgroundColor = "#dddddd";
                } else if (isSelected) {
                  borderWidth = 2;
                  borderColor = "#0A84FF";
                }

                return (
                  <Pressable
                    key={seat.id}
                    style={[
                      styles.seatBox,
                      { backgroundColor, borderWidth, borderColor },
                    ]}
                    onPress={() => handleSeatPress(seat)}
                  >
                    <Text>{seat.seatCode}</Text>
                  </Pressable>
                );
              })}
            </View>
          ))}
        </ScrollView>
      )}

      <View style={styles.seatFooter}>
        <Text>
          선택한 좌석:{" "}
          {selectedCar && selectedSeatCode
            ? `${selectedCar.carNo}호차 ${selectedSeatCode}`
            : "-"}
        </Text>
        <Button title="확인" onPress={handleConfirm} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  stepTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 16 },
  trainInfo: { textAlign: "center", marginBottom: 4, color: "#555" },
  carTabRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  carTab: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  carTabActive: {
    borderColor: "#0A84FF",
    backgroundColor: "#0A84FF11",
  },
  seatScroll: { paddingHorizontal: 24, paddingBottom: 24, marginTop: 8 },
  seatRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  seatBox: {
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  seatFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
