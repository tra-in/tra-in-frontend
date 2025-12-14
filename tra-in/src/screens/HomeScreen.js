import React, { useEffect, useState } from "react";
import {  View,  Text,  StyleSheet,  Pressable,  TouchableOpacity,  Modal,  FlatList,} from "react-native";
import { API_BASE } from "../config/api";
import ScreenHeader from "../components/ScreenHeader";
import BottomNavigation from "../navigation/BottomNavigation";

const DATE_OPTIONS = ["2025-12-16", "2025-12-17", "2025-12-18"];

export default function HomeScreen({
  setActiveTab,
  setActiveScreen,
  searchParams,
  setSearchParams,
}) {
  const [ticketType, setTicketType] = useState(
    searchParams?.isHopper ? "hopper" : "normal"
  );

  const [stations, setStations] = useState([]);
  const [origin, setOrigin] = useState(searchParams?.originName || "부산");
  const [dest, setDest] = useState(searchParams?.destName || "대전");
  const [date, setDate] = useState(searchParams?.date || DATE_OPTIONS[0]);
  const [passengers, setPassengers] = useState(searchParams?.passengers || 1);

  const [stationModalVisible, setStationModalVisible] = useState(false);
  const [stationSelectMode, setStationSelectMode] = useState("origin"); // 'origin' | 'dest'

  useEffect(() => {
    fetch(`${API_BASE}/stations`)
      .then((res) => res.json())
      .then((data) => {
        setStations(data);
        if (!searchParams && data.length >= 2) {
          setOrigin(data[0].name);
          setDest(data[1].name);
        }
      })
      .catch((e) => console.error("stations error", e));
  }, []);

  const openStationModal = (mode) => {
    setStationSelectMode(mode);
    setStationModalVisible(true);
  };

  const handleSelectStation = (name) => {
    if (stationSelectMode === "origin") {
      setOrigin(name);
      if (name === dest) {
        const other = stations.find((s) => s.name !== name);
        if (other) setDest(other.name);
      }
    } else {
      setDest(name);
      if (name === origin) {
        const other = stations.find((s) => s.name !== name);
        if (other) setOrigin(other.name);
      }
    }
    setStationModalVisible(false);
  };

  const incrPassengers = () => setPassengers((p) => Math.min(p + 1, 9));
  const decrPassengers = () => setPassengers((p) => (p > 1 ? p - 1 : 1));

  const handleSearch = () => {
    setSearchParams({
      originName: origin,
      destName: dest,
      date,
      passengers,
      isHopper: ticketType === "hopper",
    });
    setActiveScreen("preferenceSurvey");
  };

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="트레:in(人)"
        showBackButton={false}
      />

      <View style={styles.content}>
        {/* 승차권 / 메뚜기 토글 */}
        <View style={styles.ticketTypeRow}>
          <Pressable
            style={[
              styles.ticketTypeButton,
              ticketType === "normal" && styles.ticketTypeButtonActive,
            ]}
            onPress={() => setTicketType("normal")}
          >
            <Text
              style={[
                styles.ticketTypeText,
                ticketType === "normal" && styles.ticketTypeTextActive,
              ]}
            >
              승차권 예매
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.ticketTypeButton,
              ticketType === "hopper" && styles.ticketTypeButtonActive,
            ]}
            onPress={() => setTicketType("hopper")}
          >
            <Text
              style={[
                styles.ticketTypeText,
                ticketType === "hopper" && styles.ticketTypeTextActive,
              ]}
            >
              메뚜기 예매
            </Text>
          </Pressable>
        </View>

        {/* 출발/도착/날짜/인원 카드 */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>출발</Text>
          <TouchableOpacity onPress={() => openStationModal("origin")}>
            <Text style={styles.stationText}>{origin}</Text>
          </TouchableOpacity>

          <Text style={styles.arrowText}>➜</Text>

          <Text style={styles.cardLabel}>도착</Text>
          <TouchableOpacity onPress={() => openStationModal("dest")}>
            <Text style={styles.stationText}>{dest}</Text>
          </TouchableOpacity>

          <View style={styles.row}>
            <Text style={styles.smallLabel}>가는 날</Text>
            <View style={styles.dateRow}>
              {DATE_OPTIONS.map((d) => (
                <Pressable
                  key={d}
                  style={[
                    styles.dateChip,
                    date === d && styles.dateChipActive,
                  ]}
                  onPress={() => setDate(d)}
                >
                  <Text
                    style={[
                      styles.dateChipText,
                      date === d && styles.dateChipTextActive,
                    ]}
                  >
                    {d}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.row}>
            <Text style={styles.smallLabel}>인원 선택</Text>
            <View style={styles.passengerRow}>
              <Pressable style={styles.countButton} onPress={decrPassengers}>
                <Text>-</Text>
              </Pressable>
              <Text style={styles.smallValue}>어른 {passengers}명</Text>
              <Pressable style={styles.countButton} onPress={incrPassengers}>
                <Text>+</Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* 열차 조회 버튼 */}
        <Pressable style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>열차 조회</Text>
        </Pressable>

        {/* 역 선택 모달 */}
        <Modal
          visible={stationModalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setStationModalVisible(false)}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>
                {stationSelectMode === "origin" ? "출발역 선택" : "도착역 선택"}
              </Text>
              <FlatList
                data={stations}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item }) => (
                  <Pressable
                    style={styles.modalItem}
                    onPress={() => handleSelectStation(item.name)}
                  >
                    <Text>{item.name}</Text>
                  </Pressable>
                )}
              />
              <Pressable
                style={styles.modalClose}
                onPress={() => setStationModalVisible(false)}
              >
                <Text>닫기</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>
      <BottomNavigation activeTab="home" setActiveTab={setActiveTab} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },

  ticketTypeRow: { flexDirection: "row", marginBottom: 16 },
  ticketTypeButton: {
    flex: 1,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginRight: 8,
    alignItems: "center",
  },
  ticketTypeButtonActive: {
    backgroundColor: "#0A84FF11",
    borderColor: "#0A84FF",
  },
  ticketTypeText: { fontSize: 14, color: "#444" },
  ticketTypeTextActive: { color: "#0A84FF", fontWeight: "bold" },

  card: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fafafa",
    marginBottom: 16,
  },
  cardLabel: { fontSize: 12, color: "#999" },
  stationText: { fontSize: 20, fontWeight: "bold", marginBottom: 8 },
  arrowText: { fontSize: 20, alignSelf: "center", marginVertical: 4 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  smallLabel: { fontSize: 13, color: "#777" },
  smallValue: { fontSize: 14, color: "#333" },
  passengerRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  countButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
    justifyContent: "center",
  },

  dateRow: { flexDirection: "row", gap: 8 },
  dateChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  dateChipActive: { borderColor: "#0A84FF", backgroundColor: "#0A84FF11" },
  dateChipText: { fontSize: 12 },
  dateChipTextActive: { color: "#0A84FF", fontWeight: "bold" },

  searchButton: {
    marginTop: 8,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#FFF9D9",
    borderWidth: 1,
    borderColor: "#F2D16B",
    alignItems: "center",
  },
  searchButtonText: { fontSize: 16, fontWeight: "600", color: "#555" },

  modalBackdrop: {
    flex: 1,
    backgroundColor: "#00000055",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "80%",
    maxHeight: "70%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 12 },
  modalItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalClose: {
    marginTop: 8,
    alignSelf: "center",
    padding: 8,
  },
});
