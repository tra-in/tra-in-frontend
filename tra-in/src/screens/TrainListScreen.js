import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { API_BASE } from '../config/api';

export default function TrainListScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  const {
    leg,               // 1 or 2
    originName,        // '부산' or 경유지
    destName,          // 경유지 or '대전'
    minDepartureTime,  // 2구간일 때만 존재
    firstLegInfo,      // 2구간일 때, 1구간 정보
  } = route.params;

  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams({
      origin: originName,
      dest: destName,
    });
    if (minDepartureTime) {
      params.append('after', minDepartureTime);
    }

    fetch(`${API_BASE}/trains?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setTrains(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('train list error', err);
        setLoading(false);
      });
  }, [originName, destName, minDepartureTime]);

  const handlePressTrain = (train) => {
    navigation.navigate('SeatSelect', {
      leg,
      train,
      originName,
      destName,
      firstLegInfo,
    });
  };

  const renderItem = ({ item }) => (
    <Pressable style={styles.card} onPress={() => handlePressTrain(item)}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={styles.trainNo}>
          {item.trainType} {item.trainNo}
        </Text>
        <Text>
          {item.departureTime.slice(11, 16)} → {item.arrivalTime.slice(11, 16)}
        </Text>
      </View>
      <Text style={styles.routeText}>
        {item.origin} → {item.dest}
      </Text>
    </Pressable>
  );

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
        {leg === 1 ? '1구간' : '2구간'} {originName} → {destName}
      </Text>

      <FlatList
        data={trains}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        ListEmptyComponent={<Text>해당 구간의 열차가 없습니다.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60, paddingHorizontal: 16, backgroundColor: '#fff' },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  card: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 8,
  },
  trainNo: { fontSize: 16, fontWeight: '600' },
  routeText: { marginTop: 4, color: '#666' },
});
