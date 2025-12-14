import React, { useEffect, useMemo, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  ScrollView,
  ActivityIndicator,
  Button,
  Alert,
} from "react-native";
import { API_BASE } from "../config/api";
import ScreenHeader from "../components/ScreenHeader";
import BottomNavigation from "../navigation/BottomNavigation";

const DATE_OPTIONS = ["2025-12-16", "2025-12-17", "2025-12-18"];

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
  let data = await searchOnce(origin, dest, baseDate, null);
  if (Array.isArray(data) && data.length > 0) return true;

  const nextDate = plusOneDay(baseDate);
  data = await searchOnce(origin, dest, nextDate, null);
  return Array.isArray(data) && data.length > 0;
}

function formatMonthDay(dateTimeStr) {
  if (!dateTimeStr) return "";
  const month = dateTimeStr.slice(5, 7);
  const day = dateTimeStr.slice(8, 10);
  return `${month}/${day}`;
}

/* ==================== 열차 목록 컴포넌트 ==================== */
function TrainList({ title, origin, dest, baseDate, after, onSelect }) {
  const [selectedDate, setSelectedDate] = useState(baseDate);
  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setSelectedDate(baseDate);
  }, [baseDate]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    async function load() {
      try {
        const data = await searchOnce(origin, dest, selectedDate, after);
        if (cancelled) return;
        setTrains(Array.isArray(data) ? data : []);
        setLoading(false);
      } catch (e) {
        if (!cancelled) {
          console.error("train list error", e);
          setTrains([]);
          setLoading(false);
        }
      }
    }

    if (origin && dest && selectedDate) load();
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

/* ==================== 좌석 선택 컴포넌트 ==================== */
function SeatSelect({ legTitle, train, date, onConfirm }) {
  const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [seats, setSeats] = useState([]);
  const [loadingSeats, setLoadingSeats] = useState(false);
  const [selectedSeatCode, setSelectedSeatCode] = useState(null);

  useEffect(() => {
    if (!train?.id) return;
    let cancelled = false;

    fetch(`${API_BASE}/trains/${train.id}/cars`)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        setCars(data);
        if (data.length > 0) loadSeatsForCar(data[0]);
      })
      .catch((e) => console.error("cars error", e));

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [train?.id]);

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
        {train.departureTime.slice(11, 16)} →{" "}
        {train.arrivalTime.slice(11, 16)}
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

                if (seat.status === "SOLD") backgroundColor = "#dddddd";
                else if (isSelected) {
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
export default function BookingScreen({
  setActiveTab,
  searchParams,
  user,
  userPreference,
  openTravelFlow,
  pendingFlowResult,
  clearPendingFlowResult,
}) {
  // ✅ stations 요청 토큰
  const stationsReqIdRef = useRef(0);
  const invalidateStationsRequest = () => {
    stationsReqIdRef.current += 1;
  };

  const [mode, setMode] = useState(null); // direct | hopper
  const [routeStops, setRouteStops] = useState([]);
  const [currentLegIndex, setCurrentLegIndex] = useState(0);
  const [step, setStep] = useState("init");

  const [stations, setStations] = useState([]);
  const [selectedTrains, setSelectedTrains] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);

  const [waypointPhase, setWaypointPhase] = useState("first"); // first|second
  const [wp1, setWp1] = useState(null);
  const [wp2, setWp2] = useState(null);
  const [wp2Candidates, setWp2Candidates] = useState([]);

  const [validatingWaypoints, setValidatingWaypoints] = useState(false);
  const [waypointError, setWaypointError] = useState("");

  const askRecommend = (region, onYes, onNo) => {
    Alert.alert("여행 추천", `${region} 여행 추천을 받겠습니까?`, [
      { text: "아니요", style: "cancel", onPress: onNo },
      { text: "네", onPress: onYes },
    ]);
  };

  const askSecondWaypoint = (onYes, onNo) => {
    Alert.alert("2번째 경유지", "2번째 경유지를 선택할까요?", [
      { text: "아니요", style: "cancel", onPress: onNo },
      { text: "네", onPress: onYes },
    ]);
  };

  const loadFirstWaypointCandidates = async () => {
    if (!searchParams) return;

    const reqId = ++stationsReqIdRef.current;

    const baseDate = searchParams.date;
    const originName = searchParams.originName;

    try {
      setValidatingWaypoints(true);
      setWaypointError("");
      setStations([]);

      const res = await fetch(`${API_BASE}/stations`);
      const data = await res.json();

      if (reqId !== stationsReqIdRef.current) return;

      const baseList = data.filter(
        (s) =>
          s.name !== searchParams.originName && s.name !== searchParams.destName
      );

      const firstCandidates = [];
      for (const s of baseList) {
        const ok = await hasAnyTrain(originName, s.name, baseDate);
        if (reqId !== stationsReqIdRef.current) return;
        if (ok) firstCandidates.push(s);
      }

      if (reqId !== stationsReqIdRef.current) return;

      setStations(firstCandidates);

      if (firstCandidates.length === 0) {
        setWaypointError(
          "선택 가능한 경유지가 없습니다. 다른 출발/도착 역을 선택해 주세요."
        );
      }

      setWaypointPhase("first");
      setStep("waypoints");
    } catch (e) {
      // ✅ 오래된 요청이면 무시
      if (reqId !== stationsReqIdRef.current) return;

      console.error(e);
      setWaypointError("경유지 후보를 불러오는 중 오류가 발생했습니다.");
      setWaypointPhase("first");
      setStep("waypoints");
    } finally {
      if (reqId !== stationsReqIdRef.current) return;
      setValidatingWaypoints(false);
    }
  };

  const computeWp2Candidates = async (wp1Name) => {
    if (!searchParams) return [];
    const baseDate = searchParams.date;

    let baseStations = stations;
    if (!baseStations || baseStations.length === 0) {
      try {
        const res = await fetch(`${API_BASE}/stations`);
        const data = await res.json();
        baseStations = data.filter(
          (s) =>
            s.name !== searchParams.originName &&
            s.name !== searchParams.destName &&
            s.name !== wp1Name
        );
      } catch {
        baseStations = [];
      }
    }

    const candidates = [];
    for (const s of baseStations) {
      if (
        s.name === searchParams.originName ||
        s.name === searchParams.destName ||
        s.name === wp1Name
      ) {
        continue;
      }

      const okFromWp1 = await hasAnyTrain(wp1Name, s.name, baseDate);
      if (!okFromWp1) continue;

      const okToDest = await hasAnyTrain(
        s.name,
        searchParams.destName,
        baseDate
      );
      if (!okToDest) continue;

      candidates.push(s.name);
    }

    setWp2Candidates(candidates);
    return candidates;
  };

  /** ✅ 도착역 추천 후 train으로 */
  const goDestRecommendThenTrain = (finalStops) => {
    const dest = searchParams?.destName;

    const stops =
      Array.isArray(finalStops) && finalStops.length >= 2
        ? finalStops
        : [searchParams.originName, searchParams.destName];

    if (!dest) {
      invalidateStationsRequest(); // ✅ 중요
      setRouteStops(stops);
      setCurrentLegIndex(0);
      setStep("train");
      return;
    }

    askRecommend(
      dest,
      () => {
        const snapshot = {
          routeStops: stops,
          wp1: stops.length >= 3 ? stops[1] : null,
          wp2: stops.length === 4 ? stops[2] : null,
        };
        openTravelFlow({
          mode: "hopper",
          region: dest,
          context: "dest",
          snapshot,
        });
      },
      () => {
        invalidateStationsRequest(); // ✅ 중요
        setRouteStops(stops);
        setCurrentLegIndex(0);
        setStep("train");
      }
    );
  };

  /** 최초 진입 */
  useEffect(() => {
    if (!searchParams) return;

    const m = searchParams.isHopper ? "hopper" : "direct";
    setMode(m);

    setSelectedTrains([]);
    setSelectedSeats([]);
    setCurrentLegIndex(0);

    if (m === "direct") {
      invalidateStationsRequest();
      setRouteStops([searchParams.originName, searchParams.destName]);
      setStep("train");
    } else {
      setRouteStops([]);
      setWp1(null);
      setWp2(null);
      setWp2Candidates([]);
      setWaypointError("");
      setStep("init");
      setWaypointPhase("first");
      loadFirstWaypointCandidates();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  /** ✅ TravelFlow 결과 처리 (snapshot 기반 복원) */
  useEffect(() => {
    if (!pendingFlowResult || !searchParams) return;

    // ✅ TravelFlow 결과가 들어오면, stations 로딩이 나중에 끝나서 waypoints로 덮어쓰지 못하게 무효화!
    invalidateStationsRequest();

    const { context, region, snapshot } = pendingFlowResult;
    const done = () => clearPendingFlowResult?.();

    if (context === "wp1") {
      const wp1Name = snapshot?.wp1 ?? region;

      (async () => {
        setWp1(wp1Name);
        setWaypointError("");
        setValidatingWaypoints(true);
        const candidates = await computeWp2Candidates(wp1Name);
        setValidatingWaypoints(false);

        if (!candidates || candidates.length === 0) {
          const finalStops = [
            searchParams.originName,
            wp1Name,
            searchParams.destName,
          ];
          setWp2(null);
          setRouteStops(finalStops);
          done();
          goDestRecommendThenTrain(finalStops);
          return;
        }

        askSecondWaypoint(
          () => {
            setWaypointPhase("second");
            setStep("waypoints");
            done();
          },
          () => {
            const finalStops = [
              searchParams.originName,
              wp1Name,
              searchParams.destName,
            ];
            setWp2(null);
            setRouteStops(finalStops);
            done();
            goDestRecommendThenTrain(finalStops);
          }
        );
      })();

      return;
    }

    if (context === "wp2") {
      const finalStops =
        snapshot?.routeStops ??
        [searchParams.originName, wp1, region, searchParams.destName];

      setWp2(snapshot?.wp2 ?? region);
      setWp1(snapshot?.wp1 ?? wp1);
      setRouteStops(finalStops);

      done();
      goDestRecommendThenTrain(finalStops);
      return;
    }

    if (context === "dest") {
      const finalStops = snapshot?.routeStops;
      if (Array.isArray(finalStops) && finalStops.length >= 2) {
        setRouteStops(finalStops);
        setWp1(snapshot?.wp1 ?? wp1);
        setWp2(snapshot?.wp2 ?? wp2);
      } else {
        setRouteStops([searchParams.originName, searchParams.destName]);
      }

      setSelectedTrains([]);
      setSelectedSeats([]);
      setCurrentLegIndex(0);
      setStep("train");

      done();
      return;
    }

    done();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingFlowResult, searchParams]);

  /** ✅ 안전장치: train인데 legs 없으면 routeStops 복구 */
  useEffect(() => {
    if (!searchParams) return;
    if (step !== "train" && step !== "seat" && step !== "summary") return;

    if (!routeStops || routeStops.length < 2) {
      invalidateStationsRequest();
      setRouteStops([searchParams.originName, searchParams.destName]);
      setSelectedTrains([]);
      setSelectedSeats([]);
      setCurrentLegIndex(0);
      setStep("train");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, routeStops, searchParams]);

  const legs = useMemo(() => {
    const res = [];
    for (let i = 0; i < routeStops.length - 1; i++) {
      res.push({ from: routeStops[i], to: routeStops[i + 1] });
    }
    return res;
  }, [routeStops]);

  const currentLeg = legs[currentLegIndex];

  const goSummaryIfDone = () => {
    if (currentLegIndex === legs.length - 1) setStep("summary");
    else {
      setCurrentLegIndex((idx) => idx + 1);
      setStep("train");
    }
  };

  const handleReserve = async () => {
    if (!user || !user.id) {
      Alert.alert("오류", "로그인 정보가 없습니다.");
      return;
    }

    const legsPayload = legs
      .map((leg, idx) => {
        const train = selectedTrains[idx];
        const seat = selectedSeats[idx];
        if (!train || !seat) return null;

        return {
          originStation: leg.from,
          destStation: leg.to,
          departureTime: train.departureTime,
          arrivalTime: train.arrivalTime,
          trainNo: train.trainNo,
          carNo: seat.carNo,
          seatCode: seat.seatCode,
        };
      })
      .filter(Boolean);

    if (legsPayload.length === 0) {
      Alert.alert("알림", "저장할 예매 정보가 없습니다.");
      return;
    }

    const payload = {
      userId: user.id,
      isHopper: mode === "hopper",
      legs: legsPayload,
      preferenceType: userPreference ?? null,
      recommendStation:
        mode === "direct"
          ? searchParams.destName
          : routeStops[routeStops.length - 1] ?? null,
    };

    try {
      const res = await fetch(`${API_BASE}/user-tickets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        console.error("reserve error", await res.text());
        Alert.alert("오류", "예매 저장에 실패했습니다.");
        return;
      }

      Alert.alert("완료", "예매가 저장되었습니다.");
      setActiveTab("home");
    } catch (e) {
      console.error("reserve error", e);
      Alert.alert("오류", "예매 저장 중 문제가 발생했습니다.");
    }
  };

  /** ---------------- 화면 분기 ---------------- */
  let body = null;

  if (!searchParams) {
    body = (
      <View style={styles.center}>
        <Text>홈 화면에서 먼저 조건을 선택해 주세요.</Text>
        <Button title="홈으로" onPress={() => setActiveTab("home")} />
      </View>
    );
  } else if (
    mode === "hopper" &&
    step === "waypoints" &&
    waypointPhase === "first"
  ) {
    body = (
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
              onPress={() => {
                const wp = s.name;

                askRecommend(
                  wp,
                  () => {
                    openTravelFlow({
                      mode: "hopper",
                      region: wp,
                      context: "wp1",
                      snapshot: { wp1: wp },
                    });
                  },
                  async () => {
                    setWp1(wp);
                    setWaypointError("");

                    setValidatingWaypoints(true);
                    const candidates = await computeWp2Candidates(wp);
                    setValidatingWaypoints(false);

                    if (!candidates || candidates.length === 0) {
                      const finalStops = [
                        searchParams.originName,
                        wp,
                        searchParams.destName,
                      ];
                      setWp2(null);
                      setRouteStops(finalStops);
                      goDestRecommendThenTrain(finalStops);
                      return;
                    }

                    askSecondWaypoint(
                      () => {
                        setWaypointPhase("second");
                        setStep("waypoints");
                      },
                      () => {
                        const finalStops = [
                          searchParams.originName,
                          wp,
                          searchParams.destName,
                        ];
                        setWp2(null);
                        setRouteStops(finalStops);
                        goDestRecommendThenTrain(finalStops);
                      }
                    );
                  }
                );
              }}
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
  } else if (
    mode === "hopper" &&
    step === "waypoints" &&
    waypointPhase === "second"
  ) {
    body = (
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
              onPress={() => {
                const wp = name;

                askRecommend(
                  wp,
                  () => {
                    const finalStops = [
                      searchParams.originName,
                      wp1,
                      wp,
                      searchParams.destName,
                    ];
                    openTravelFlow({
                      mode: "hopper",
                      region: wp,
                      context: "wp2",
                      snapshot: { wp1, wp2: wp, routeStops: finalStops },
                    });
                  },
                  () => {
                    const finalStops = [
                      searchParams.originName,
                      wp1,
                      wp,
                      searchParams.destName,
                    ];
                    setWp2(wp);
                    setRouteStops(finalStops);
                    goDestRecommendThenTrain(finalStops);
                  }
                );
              }}
            >
              <Text style={wp2 === name && { color: "#0A84FF", fontWeight: "bold" }}>
                {name}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        <View style={{ marginTop: 16 }}>
          <Button
            title="2번째 경유지 없이 진행"
            onPress={() => {
              const finalStops = [
                searchParams.originName,
                wp1,
                searchParams.destName,
              ];
              setWp2(null);
              setRouteStops(finalStops);
              goDestRecommendThenTrain(finalStops);
            }}
          />
          <View style={{ height: 8 }} />
          <Button
            title="1번째 경유지 다시 선택"
            onPress={() => {
              setWp2(null);
              setWp2Candidates([]);
              setWaypointPhase("first");
              setStep("waypoints");
            }}
          />
        </View>
      </View>
    );
  } else if (step === "train" && currentLeg) {
    const from = currentLeg.from;
    const to = currentLeg.to;

    let after = null;
    if (currentLegIndex > 0) {
      const prevTrain = selectedTrains[currentLegIndex - 1];
      after = prevTrain ? prevTrain.arrivalTime : null;
    }

    body = (
      <View style={styles.container}>
        <TrainList
          title={`구간 ${currentLegIndex + 1}: ${from} → ${to}`}
          origin={from}
          dest={to}
          baseDate={searchParams.date}
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
  } else if (step === "seat") {
    const train = selectedTrains[currentLegIndex];
    body = (
      <View style={styles.container}>
        <SeatSelect
          legTitle={`구간 ${currentLegIndex + 1} 좌석 선택`}
          train={train}
          date={searchParams.date}
          onConfirm={(seatInfo) => {
            const newSeats = [...selectedSeats];
            newSeats[currentLegIndex] = seatInfo;
            setSelectedSeats(newSeats);
            goSummaryIfDone();
          }}
        />
      </View>
    );
  } else if (step === "summary") {
    body = (
      <View style={styles.container}>
        <Text style={styles.title}>
          {mode === "direct" ? "여행 요약 (직행)" : "여행 요약 (메뚜기)"}
        </Text>
        <Text>날짜: {searchParams.date}</Text>
        <Text>인원: 어른 {searchParams.passengers}명</Text>

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
                {train.arrivalTime.slice(11, 16)} (
                {formatMonthDay(train.departureTime)})
              </Text>
              <Text>
                좌석: {seat.carNo}호차 {seat.seatCode}
              </Text>
            </View>
          );
        })}

        <View style={{ marginTop: 32 }}>
          <Button title="예매하기" onPress={handleReserve} />
          <View style={{ height: 8 }} />
          <Button title="홈으로" onPress={() => setActiveTab("home")} />
        </View>
      </View>
    );
  } else {
    body = (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text style={{ marginTop: 8, color: "#666" }}>화면을 준비 중...</Text>
      </View>
    );
  }

  return (
    <View style={styles.pageContainer}>
      <ScreenHeader
        title="트레:in(人)"
        showBackButton={true}
        onBackPress={() => setActiveTab("home")}
      />
      {body}
      <BottomNavigation activeTab="home" setActiveTab={setActiveTab} />
    </View>
  );
}

/* ==================== 스타일 ==================== */
const styles = StyleSheet.create({
  pageContainer: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1, paddingTop: 16, paddingHorizontal: 24 },
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

  trainDateRow: { flexDirection: "row", gap: 8, marginBottom: 8 },
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
  trainDateChipText: { fontSize: 12, color: "#555" },
  trainDateChipTextActive: { color: "#0A84FF", fontWeight: "bold" },
});
