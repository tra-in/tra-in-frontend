import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const WAYPOINTS = ['울산', '경주', '동대구', '김천구미', '전주'];

export default function WaypointSelectScreen() {
  const navigation = useNavigation();

  const handleSelectWaypoint = (waypoint) => {
    // 1구간 열차 목록 화면으로 이동
    navigation.navigate('TrainList', {
      leg: 1,
      originName: '부산',
      destName: waypoint,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>희망 경유지 선택</Text>
      <Text style={styles.subtitle}>부산 → (경유지) → 대전</Text>

      {WAYPOINTS.map((wp) => (
        <Pressable
          key={wp}
          style={styles.item}
          onPress={() => handleSelectWaypoint(wp)}
        >
          <Text style={styles.itemText}>{wp}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60, paddingHorizontal: 24, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 8 },
  subtitle: { fontSize: 14, marginBottom: 24, color: '#666' },
  item: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#0A84FF',
    marginBottom: 12,
  },
  itemText: { fontSize: 16 },
});
