import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  ScrollView,
  ActivityIndicator,
  Button,
} from "react-native";
import { API_BASE } from "../config/api";

/** 날짜 문자열(YYYY-MM-DD)을 하루 뒤로 */
function plusOneDay(dateStr) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

/** 한 번만 조회 (특정 날짜 + after 옵션) */
function searchOnce(origin, dest, date, after) {
  const params = new URLSearchParams({ origin, dest, date });
  if (after) params.append("after", after);
  return fetch(`${API_BASE}/trains?${params.toString()}`).then((res) =>
    res.json()
  );
}

/** origin→dest 구간에서 오늘 or 내일 중 하루라도 열차가 있는지 */
async function hasAnyTrain(origin, dest, baseDate) {
  // 오늘
  let data = await searchOnce(origin, dest, baseDate, null);
  if (Array.isArray(data) && data.length > 0) return true;

  // 내일
  const nextDate = plusOneDay(baseDate);
  data = await searchOnce(origin, dest, nextDate, null);
  return Array.isArray(data) && data.length > 0;
}

/* ==================== 열차 목록 컴포넌트 ==================== */
function TrainList({ title, origin, dest, date, after, onSelect }) {
  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usedDate, setUsedDate] = useState(date); // 실제 사용한 날짜 (오늘/내일)

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setUsedDate(date);

    async function load() {
      try {
        // 1차: 원래 날짜
        let data = await searchOnce(origin, dest, date, after);
        if (!cancelled && Array.isArray(data) && data.length > 0) {
          setTrains(data);
          setLoading(false);
          return;
        }

        // 2차: 다음 날 (after는 의미 없으니 null)
        const nextDate = plusOneDay(date);
        data = await searchOnce(origin, dest, nextDate, null);
        if (!cancelled && Array.isArray(data) && data.length > 0) {
          setTrains(data);
          setUsedDate(nextDate);
          setLoading(false);
          return;
        }

        // 둘 다 없으면 빈 배열
        if (!cancelled) {
          setTrains([]);
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

    if (origin && dest && date) {
      load();
    }

    return () => {
      cancelled = true;
    };
  }, [origin, dest, date, after]);

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
          {item.departureTime.slice(11, 16)} →{" "}
          {item.arrivalTime.slice(11, 16)}
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
        {title} ({usedDate} 기준)
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

/* ==================== 좌석 선택 컴포넌트 ==================== */
function SeatSelect({ legTitle, train, date, onConfirm }) {
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
        {train.trainType} {train.trainNo} |{" "}
        {train.departureTime.slice(11, 16)} → {train.arrivalTime.slice(11, 16)}
      </Text>

      {/* 호차 선택 탭 */}
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

      {/* 좌석 그리드 */}
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

/* ==================== 메인 화면 ==================== */
export default function BookingScreen({ setActiveTab, searchParams }) {
  const [mode, setMode] = useState(null); // 'direct' | 'hopper'
  const [routeStops, setRouteStops] = useState([]);
  const [currentLegIndex, setCurrentLegIndex] = useState(0);
  const [step, setStep] = useState("init");
  const [stations, setStations] = useState([]);

  const [selectedTrains, setSelectedTrains] = useState([]); // 각 구간 열차
  const [selectedSeats, setSelectedSeats] = useState([]); // 각 구간 좌석

  // 경유지 단계
  const [waypointPhase, setWaypointPhase] = useState("first"); // 'first' | 'second'
  const [wp1, setWp1] = useState(null);
  const [wp2, setWp2] = useState(null);
  const [wp2Candidates, setWp2Candidates] = useState([]);

  // 로딩/에러
  const [validatingWaypoints, setValidatingWaypoints] = useState(false);
  const [waypointError, setWaypointError] = useState("");

  useEffect(() => {
    if (!searchParams) return;

    const m = searchParams.isHopper ? "hopper" : "direct";
    setMode(m);

    if (m === "direct") {
      setRouteStops([searchParams.originName, searchParams.destName]);
      setCurrentLegIndex(0);
      setStep("train");
    } else {
        // hopper: 경유지 선택을 위해 역 목록 필요 + 1구간(출발지→경유1)에 열차 있는 역만 필터링
        const baseDate = searchParams.date;
        const originName = searchParams.originName;

        async function loadStations() {
          try {
            setValidatingWaypoints(true);
            setWaypointError("");
            setStations([]);
            setWaypointPhase("first");
            setWp1(null);
            setWp2(null);
            setWp2Candidates([]);

            const res = await fetch(`${API_BASE}/stations`);
            const data = await res.json();

            // 출발/도착 제외한 기본 역 목록
            const baseList = data.filter(
              (s) =>
                s.name !== searchParams.originName &&
                s.name !== searchParams.destName
            );

            const firstCandidates = [];

            // ✅ 출발지 → 해당 역 구간에 (오늘/내일 기준) 열차가 있는 역만 남기기
            for (const s of baseList) {
              const ok = await hasAnyTrain(originName, s.name, baseDate);
              if (ok) {
                firstCandidates.push(s);
              }
            }

            setStations(firstCandidates);

            if (firstCandidates.length === 0) {
              setWaypointError(
                "선택 가능한 경유지가 없습니다. 다른 출발/도착 역을 선택해 주세요."
              );
            }

            setStep("waypoints");
          } catch (e) {
            console.error("stations for hopper error", e);
            setWaypointError(
              "경유지 후보를 불러오는 중 오류가 발생했습니다."
            );
          } finally {
            setValidatingWaypoints(false);
          }
        }

        loadStations();
      }
  }, [searchParams]);

  if (!searchParams) {
    return (
      <View style={styles.center}>
        <Text>홈 화면에서 먼저 조건을 선택해 주세요.</Text>
        <Button title="홈으로" onPress={() => setActiveTab("home")} />
      </View>
    );
  }

  const date = searchParams.date;
  const passengers = searchParams.passengers;

  const legs = useMemo(() => {
    const res = [];
    for (let i = 0; i < routeStops.length - 1; i++) {
      res.push({ from: routeStops[i], to: routeStops[i + 1] });
    }
    return res;
  }, [routeStops]);

  const currentLeg = legs[currentLegIndex];

  const goSummaryIfDone = () => {
    if (currentLegIndex === legs.length - 1) {
      setStep("summary");
    } else {
      setCurrentLegIndex((idx) => idx + 1);
      setStep("train");
    }
  };

  /* ====== 경유지 선택 로직 ====== */

  // 1번째 경유지 선택
  const handleSelectFirstWaypoint = async (name) => {
    setWaypointError("");
    setValidatingWaypoints(true);
    setWp1(name);

    try {
      const baseDate = searchParams.date;
      const candidates = [];

      for (const s of stations) {
        if (
          s.name === searchParams.originName ||
          s.name === searchParams.destName ||
          s.name === name
        ) {
          continue;
        }

        const okFromWp1 = await hasAnyTrain(name, s.name, baseDate);
        if (!okFromWp1) continue;

        const okToDest = await hasAnyTrain(s.name, searchParams.destName, baseDate);
        if (!okToDest) continue;

        candidates.push(s.name);
      }

      setWp2Candidates(candidates);

      if (candidates.length === 0) {
        setWaypointError(
          `선택한 경유지(${name})에서 갈 수 있고 도착지까지 이어지는 역이 없습니다. 다른 경유지를 선택해 주세요.`
        );
        setWaypointPhase("first");
      } else {
        setWaypointPhase("second");
      }
    } catch (e) {
      console.error("WP1 선택 처리 오류", e);
      setWaypointError("경유지 후보를 계산하는 중 오류가 발생했습니다.");
      setWaypointPhase("first");
    } finally {
      setValidatingWaypoints(false);
    }
  };

  // 최종 경유 조합 확정
  const confirmWaypoints = (useSecond) => {
    const stops = useSecond
      ? [searchParams.originName, wp1, wp2, searchParams.destName]
      : [searchParams.originName, wp1, searchParams.destName];

    setRouteStops(stops);
    setCurrentLegIndex(0);
    setStep("train");
  };

  /* ====== 화면 분기 ====== */

  // 메뚜기 모드: 1번째 경유지 선택
  if (mode === "hopper" && step === "waypoints" && waypointPhase === "first") {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>1번째 경유지 선택</Text>
        <Text style={styles.subtitle}>
          {searchParams.originName} → (경유1) → {searchParams.destName}
        </Text>

        <ScrollView>
          {stations.map((s) => (
            <Pressable
              key={s.id}
              style={styles.waypointItem}
              onPress={() => handleSelectFirstWaypoint(s.name)}
            >
              <Text>{s.name}</Text>
            </Pressable>
          ))}
        </ScrollView>

        {validatingWaypoints && (
          <Text style={{ marginTop: 8 }}>가능한 경유 조합을 확인 중...</Text>
        )}
        {waypointError ? (
          <Text style={{ color: "red", marginTop: 8 }}>{waypointError}</Text>
        ) : null}
      </View>
    );
  }

  // 메뚜기 모드: 2번째 경유지 선택 (선택 안 해도 됨)
  if (mode === "hopper" && step === "waypoints" && waypointPhase === "second") {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>2번째 경유지 선택 (선택 안 해도 됨)</Text>
        <Text style={styles.subtitle}>
          {searchParams.originName} → {wp1} → (경유2) → {searchParams.destName}
        </Text>

        <ScrollView>
          {wp2Candidates.map((name) => (
            <Pressable
              key={name}
              style={[
                styles.waypointItem,
                wp2 === name && styles.waypointItemActive,
              ]}
              onPress={() => setWp2(name)}
            >
              <Text
                style={
                  wp2 === name && { color: "#0A84FF", fontWeight: "bold" }
                }
              >
                {name}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {waypointError ? (
          <Text style={{ color: "red", marginTop: 8 }}>{waypointError}</Text>
        ) : null}

        <View style={{ marginTop: 16 }}>
          <Button
            title="2번째 경유지 없이 진행"
            onPress={() => confirmWaypoints(false)}
          />
          <View style={{ height: 8 }} />
          <Button
            title="선택한 경유지로 진행"
            onPress={() => confirmWaypoints(true)}
            disabled={!wp2}
          />
        </View>
      </View>
    );
  }

  // 2) 열차 선택 (직행 / 메뚜기 공통)
  if (step === "train" && currentLeg) {
    const from = currentLeg.from;
    const to = currentLeg.to;

    // 이전 구간의 도착시간을 after로
    let after = null;
    if (currentLegIndex > 0) {
      const prevTrain = selectedTrains[currentLegIndex - 1];
      after = prevTrain ? prevTrain.arrivalTime : null;
    }

    return (
      <View style={styles.container}>
        <TrainList
          title={`구간 ${currentLegIndex + 1}: ${from} → ${to}`}
          origin={from}
          dest={to}
          date={date}
          after={after}
          onSelect={(train) => {
            const newTrains = [...selectedTrains];
            newTrains[currentLegIndex] = train;
            setSelectedTrains(newTrains);
            setStep("seat");
          }}
        />
      </View>
    );
  }

  // 3) 좌석 선택
  if (step === "seat") {
    const train = selectedTrains[currentLegIndex];
    return (
      <View style={styles.container}>
        <SeatSelect
          legTitle={`구간 ${currentLegIndex + 1} 좌석 선택`}
          train={train}
          date={date}
          onConfirm={(seatInfo) => {
            const newSeats = [...selectedSeats];
            newSeats[currentLegIndex] = seatInfo;
            setSelectedSeats(newSeats);
            goSummaryIfDone();
          }}
        />
      </View>
    );
  }

  // 4) 요약
  if (step === "summary") {
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
            <View key={idx} style={{ marginTop: 16 }}>
              <Text style={styles.sectionTitle}>
                구간 {idx + 1}: {leg.from} → {leg.to}
              </Text>
              <Text>
                {train.trainType} {train.trainNo}
              </Text>
              <Text>
                시간: {train.departureTime.slice(11, 16)} →{" "}
                {train.arrivalTime.slice(11, 16)}
              </Text>
              <Text>
                좌석: {seat.carNo}호차 {seat.seatCode}
              </Text>
            </View>
          );
        })}

        <View style={{ marginTop: 32 }}>
          <Button
            title="다시 예매하기"
            onPress={() => {
              setSelectedSeats([]);
              setSelectedTrains([]);
              if (mode === "direct") {
                setRouteStops([
                  searchParams.originName,
                  searchParams.destName,
                ]);
                setCurrentLegIndex(0);
                setStep("train");
              } else {
                setWaypointPhase("first");
                setWp1(null);
                setWp2(null);
                setWp2Candidates([]);
                setWaypointError("");
                setStep("waypoints");
              }
            }}
          />
          <View style={{ height: 8 }} />
          <Button title="홈으로" onPress={() => setActiveTab("home")} />
        </View>
      </View>
    );
  }

  // 안전용
  return (
    <View style={styles.center}>
      <ActivityIndicator />
    </View>
  );
}

/* ==================== 스타일 ==================== */
const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60, paddingHorizontal: 24 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  title: { fontSize: 22, fontWeight: "bold", marginBottom: 8 },
  subtitle: { fontSize: 14, marginBottom: 16, color: "#666" },

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

  waypointItem: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 8,
  },
  waypointItemActive: {
    borderColor: "#0A84FF",
    backgroundColor: "#0A84FF11",
  },
  sectionTitle: { fontSize: 16, fontWeight: "600" },
});
