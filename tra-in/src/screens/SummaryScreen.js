import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';

export default function SummaryScreen() {
  const route = useRoute();
  const { firstLegInfo, secondLegInfo } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>여행 요약</Text>

      <Text style={styles.section}>1구간</Text>
      <Text>
        {firstLegInfo.train.origin} → {firstLegInfo.train.dest}
      </Text>
      <Text>
        {firstLegInfo.train.trainType} {firstLegInfo.train.trainNo} / 좌석{' '}
        {firstLegInfo.seatCode}
      </Text>

      <Text style={styles.section}>2구간</Text>
      <Text>
        {secondLegInfo.train.origin} → {secondLegInfo.train.dest}
      </Text>
      <Text>
        {secondLegInfo.train.trainType} {secondLegInfo.train.trainNo} / 좌석{' '}
        {secondLegInfo.seatCode}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60, paddingHorizontal: 24, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 24 },
  section: { marginTop: 16, fontSize: 16, fontWeight: '600' },
});
