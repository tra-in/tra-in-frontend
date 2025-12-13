import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Button, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { API_BASE } from '../config/api';

export default function SeatSelectScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  const { leg, train, originName, destName, firstLegInfo } = route.params;

  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeatCode, setSelectedSeatCode] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/trains/${train.id}/seats`)
      .then((res) => res.json())
      .then((data) => {
        setSeats(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('seat list error', err);
        setLoading(false);
      });
  }, [train.id]);

  // row 별로 그룹핑
  const seatRows = useMemo(() => {
    const map = {};
    seats.forEach((s) => {
      if (!map[s.row_no]) map[s.row_no] = [];
      map[s.row_no].push(s);
    });
    return Object.keys(map)
      .sort((a, b) => Number(a) - Number(b))
      .map((rowKey) => ({
        row: Number(rowKey),
        seats: map[rowKey].sort((a, b) => a.col.localeCompare(b.col)),
      }));
  }, [seats]);

  const handleSeatPress = (seat) => {
    if (seat.status === 'SOLD') return; // 이미 판매된 좌석
    setSelectedSeatCode(seat.seat_code);
  };

  const handleNext = () => {
    if (!selectedSeatCode) return;

    if (leg === 1) {
      // 1구간 완료 → 2구간 열차 목록으로 이동
      navigation.navigate('TrainList', {
        leg: 2,
        originName: destName,    // 경유지
        destName: '대전',        // 데모: 최종 목적지
        minDepartureTime: train.arrivalTime,
        firstLegInfo: {
          train,
          seatCode: selectedSeatCode,
        },
      });
    } else {
      // 2구간까지 완료 → 요약 화면
      navigation.navigate('Summary', {
        firstLegInfo,
        secondLegInfo: {
          train,
          seatCode: selectedSeatCode,
        },
      });
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {leg === 1 ? '1구간' : '2구간'} 좌석 선택: {originName} → {destName}
      </Text>
      <Text style={styles.sub}>
        {train.trainType} {train.trainNo} / 출발 {train.departureTime.slice(11, 16)} 도착{' '}
        {train.arrivalTime.slice(11, 16)}
      </Text>

      <ScrollView contentContainerStyle={styles.scroll}>
        {seatRows.map((row) => (
          <View key={row.row} style={styles.row}>
            {row.seats.map((seat) => {
              const isSelected = selectedSeatCode === seat.seat_code;
              let backgroundColor = '#ffffff';
              let borderWidth = 0;
              let borderColor = 'transparent';

              if (seat.status === 'SOLD') {
                backgroundColor = '#dddddd';
              } else if (isSelected) {
                borderWidth = 2;
                borderColor = '#0A84FF';
              }

              return (
                <Pressable
                  key={seat.id}
                  style={[styles.seat, { backgroundColor, borderWidth, borderColor }]}
                  onPress={() => handleSeatPress(seat)}
                >
                  <Text>{seat.seat_code}</Text>
                </Pressable>
              );
            })}
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <Text>선택한 좌석: {selectedSeatCode || '-'}</Text>
        <Button title={leg === 1 ? '다음 구간 선택' : '완료'} onPress={handleNext} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60, backgroundColor: '#fff' },
  title: { fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
  sub: { textAlign: 'center', marginBottom: 12, color: '#555' },
  scroll: { paddingHorizontal: 24, paddingBottom: 24 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  seat: {
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
