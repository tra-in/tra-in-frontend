import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { API_BASE } from "../config/api";

const DATE_OPTIONS = ["2025-12-16", "2025-12-17", "2025-12-18"];

function plusOneDay(dateStr) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

function searchOnce(origin, dest, date, after) {
  const params = new URLSearchParams({ origin, dest, date });
  if (after) params.append("after", after);
  return fetch(`${API_BASE}/trains?${params.toString()}`).then((res) =>
    res.json()
  );
}

export default function TrainList({
  title,
  origin,
  dest,
  baseDate,
  after,
  onSelect,
}) {
  const [selectedDate, setSelectedDate] = useState(baseDate);
  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    async function load() {
      try {
        const data = await searchOnce(origin, dest, selectedDate, after);
        if (!cancelled) {
          if (Array.isArray(data)) setTrains(data);
          else setTrains([]);
          setLoading(false);
        }
      } catch (e) {
        if (!cancelled) {
          console.error("train list error", e);
          setTrains([]);
          setLoading(false);
        }
      }
    }

    if (origin && dest && selectedDate) {
      load();
    }

    return () => {
      cancelled = true;
    };
  }, [origin, dest, selectedDate, after]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <Pressable style={styles.trainCard} onPress={() => onSelect(item)}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={styles.trainNo}>
          {item.trainType} {item.trainNo}
        </Text>
        <Text>
          {item.departureTime.slice(11, 16)} → {item.arrivalTime.slice(11, 16)}
        </Text>
      </View>
      <Text style={styles.trainRoute}>
        {item.origin} → {item.dest}
      </Text>
    </Pressable>
  );

  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.stepTitle}>
        {title} ({selectedDate} 기준)
      </Text>

      <View style={styles.trainDateRow}>
        {DATE_OPTIONS.map((d) => {
          const active = d === selectedDate;
          return (
            <Pressable
              key={d}
              style={[
                styles.trainDateChip,
                active && styles.trainDateChipActive,
              ]}
              onPress={() => setSelectedDate(d)}
            >
              <Text
                style={[
                  styles.trainDateChipText,
                  active && styles.trainDateChipTextActive,
                ]}
              >
                {d}
              </Text>
            </Pressable>
          );
        })}
      </View>

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
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  stepTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 16 },
  trainCard: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 8,
  },
  trainNo: { fontSize: 16, fontWeight: "600" },
  trainRoute: { marginTop: 4, color: "#666" },
  trainDateRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 8,
  },
  trainDateChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  trainDateChipActive: {
    borderColor: "#0A84FF",
    backgroundColor: "#0A84FF11",
  },
  trainDateChipText: {
    fontSize: 12,
    color: "#555",
  },
  trainDateChipTextActive: {
    color: "#0A84FF",
    fontWeight: "bold",
  },
});
