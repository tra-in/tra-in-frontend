import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Button,
  Alert,
  ScrollView,
  Pressable,
  Platform,
} from "react-native";
import { API_BASE } from "../config/api";
import ScreenHeader from "../components/ScreenHeader";
import BottomNavigation from "../navigation/BottomNavigation";
import TrainList from "../components/TrainList";
import SeatSelect from "../components/SeatSelect";
import WaypointSelector from "../components/WaypointSelector";
import BookingSummary from "../components/BookingSummary";
import { hasAnyTrain } from "../utils/booking";
import {
  selectFirstWaypoint,
  selectSecondWaypoint,
} from "../utils/waypointHandlers";
import LoadingScreen from "./LoadingScreen";


/**
 * ✅ FastAPI 서버 주소
 * - Android 에뮬레이터: 10.0.2.2
 * - iOS 시뮬레이터/웹: 127.0.0.1
 * - 실제 폰(와이파이): PC 로컬 IP로 바꿔야 함 (예: http://192.168.0.10:8000)
 */
const RECOMMEND_API_BASE = "http://10.0.2.2:8000";

// 시각 "2025-12-16T12:24:00" -> "12:24"
function formatTimeHM(iso) {
  if (!iso) return "";
  return iso.slice(11, 16);
}

// "2025-12-16T15:20:00" -> "2025년 12월 16일 15시 20분 이전 도착"
function formatDeadlineKR(iso) {
  if (!iso) return "";
  const y = iso.slice(0, 4);
  const m = String(parseInt(iso.slice(5, 7), 10));
  const d = String(parseInt(iso.slice(8, 10), 10));
  const hh = String(parseInt(iso.slice(11, 13), 10));
  const mm = String(parseInt(iso.slice(14, 16), 10));
  return `${y}년 ${m}월 ${d}일 ${hh}시 ${mm}분 이전 도착`;
}

// 긴급 경로에서 사용할 임의 좌석(1~4호차, 1A~8D) 생성
function randomSeat() {
  const carNo = Math.floor(Math.random() * 4) + 1; // 1~4
  const row = Math.floor(Math.random() * 8) + 1; // 1~8
  const cols = ["A", "B", "C", "D"];
  const col = cols[Math.floor(Math.random() * cols.length)];
  return {
    carNo,
    seatCode: `${row}${col}`,
  };
}

/* ==================== 긴급 경로 전용 화면 컴포넌트 ==================== */
function EmergencyRouteScreen({ setActiveTab, searchParams, user }) {
  const [loading, setLoading] = useState(true);
  const [routes, setRoutes] = useState([]);
  const [error, setError] = useState("");
  const [selectedRoute, setSelectedRoute] = useState(null); // 선택한 경로

  const originName = searchParams.originName;
  const destName = searchParams.destName;
  const deadline = searchParams.emergencyArrival; // "2025-12-16T16:30:00" 같은 형식

  // FastAPI 에서 추천 경로 가져오기
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError("");

        const body = {
          from_name: originName,
          to_name: destName,
          deadline: deadline,
          max_transfers: 2,
          min_transfer_min: 15,
          limit: 300,
          topk: 10,
          now: new Date().toISOString().slice(0, 19),
        };

        const url = `${RECOMMEND_API_BASE}/recommend/v2`;
        // console.log("recommend url:", url);

        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        if (!res.ok) {
          const txt = await res.text();
          throw new Error(`status ${res.status} / ${txt}`);
        }

        const json = await res.json();
        const rawRoutes = json.routes || [];

        // 각 leg에 임의 좌석 정보 붙이기
        const enriched = rawRoutes.map((r) => ({
          ...r,
          legs: (r.legs || []).map((leg) => ({
            ...leg,
            ...randomSeat(),
          })),
        }));

        if (!cancelled) {
          setRoutes(enriched);
        }
      } catch (e) {
        console.error("emergency routes error", e);
        if (!cancelled) {
          setError("긴급 경로를 불러오는 중 오류가 발생했습니다.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [originName, destName, deadline]);

  // 긴급 경로 예매 저장
  const handleReserveEmergency = async () => {
    if (!user || !user.id || !selectedRoute) return;

    const viaNames = (selectedRoute.transfer_summary || []).map(
      (t) => t.station
    );
    const stationNames = [originName, ...viaNames, destName];

    const legsPayload = (selectedRoute.legs || []).map((leg, idx) => {
      const originStation = stationNames[idx];
      const destStation = stationNames[idx + 1];

      return {
        originStation,
        destStation,
        departureTime: leg.dep_time,
        arrivalTime: leg.arr_time,
        trainNo: leg.train_no,
        carNo: leg.carNo,
        seatCode: leg.seatCode,
      };
    });

    const payload = {
      userId: user.id,
      isHopper: true,
      legs: legsPayload,
    };

    try {
      const res = await fetch(`${API_BASE}/user-tickets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        console.error("reserve emergency error", await res.text());
        Alert.alert("오류", "예매 저장에 실패했습니다.");
        return;
      }

      Alert.alert("완료", "예매가 저장되었습니다.");
      setActiveTab("home");
    } catch (e) {
      console.error("reserve emergency error", e);
      Alert.alert("오류", "예매 저장 중 문제가 발생했습니다.");
    }
  };

  /**
   * ✅ 카드 렌더링 (정렬 개선)
   * - 지역 이름 아래: 시간
   * - 화살표(→) 아래: 호차/좌석
   * - 기본 연회색, Top3만 노란색
   */
  const renderRouteItem = (route, index) => {
    const viaNames = (route.transfer_summary || []).map((t) => t.station);
    const stationNames = [originName, ...viaNames, destName];

    // 역 아래 시간 구성:
    //  - 첫 역: 1구간 출발
    //  - 중간 역: 해당 역에서 다음 leg 출발 (= legs[i].dep_time)
    //  - 마지막 역: 마지막 leg 도착
    const stationTimes = stationNames.map((_, i) => {
      if (!route.legs || route.legs.length === 0) return "";
      if (i === 0) return formatTimeHM(route.legs[0]?.dep_time);
      if (i === stationNames.length - 1)
        return formatTimeHM(route.legs[route.legs.length - 1]?.arr_time);
      return formatTimeHM(route.legs[i]?.dep_time);
    });

    const isTop3 = index < 3;

    return (
      <Pressable
        key={route.route_id ?? `${route.rank}-${index}`}
        style={[
          styles.emRouteCard,
          isTop3 ? styles.emRouteCardTop : styles.emRouteCardBase,
        ]}
        onPress={() => setSelectedRoute(route)}
      >
        <Text style={styles.emRouteRank}>#{route.rank}</Text>

        <View style={styles.timelineRow}>
          {stationNames.map((name, si) => (
            <React.Fragment key={`s-${index}-${si}`}>
              <View style={styles.stationCol}>
                <Text style={styles.stationName} numberOfLines={1}>
                  {name}
                </Text>
                <Text style={styles.stationTime}>{stationTimes[si]}</Text>
              </View>

              {si < stationNames.length - 1 && (
                <View style={styles.arrowCol}>
                  <Text style={styles.arrowText}>→</Text>
                  <Text style={styles.arrowSeat} numberOfLines={1}>
                    {route.legs?.[si]?.carNo}호차 {route.legs?.[si]?.seatCode}
                  </Text>
                </View>
              )}
            </React.Fragment>
          ))}
        </View>

        <Text style={styles.emRouteMeta}>
          환승 {route.transfers}회 • 총 소요 {route.total_duration_min}분 • 여유{" "}
          {route.arrival_slack_min}분
        </Text>
      </Pressable>
    );
  };

  // 경로 요약 화면 (선택 후)
  const renderSummary = () => {
    if (!selectedRoute) return null;

    const viaNames = (selectedRoute.transfer_summary || []).map(
      (t) => t.station
    );
    const stationNames = [originName, ...viaNames, destName];

    return (
      <View style={styles.container}>
        <Text style={styles.title}>긴급 경로</Text>
        <Text style={styles.subtitle}>{formatDeadlineKR(deadline)}</Text>

        {selectedRoute.legs.map((leg, idx) => {
          const from = stationNames[idx];
          const to = stationNames[idx + 1];
          return (
            <View key={idx} style={{ marginBottom: 12 }}>
              <Text style={styles.sectionTitle}>
                {from} → {to}
              </Text>
              <Text>
                시간: {formatTimeHM(leg.dep_time)} → {formatTimeHM(leg.arr_time)}
              </Text>
              <Text>
                열차: {leg.train_no} / 좌석: {leg.carNo}호차 {leg.seatCode}
              </Text>
            </View>
          );
        })}

        <View style={{ marginTop: 24 }}>
          <Button
            title="다른 경로 보기"
            onPress={() => setSelectedRoute(null)}
          />
          <View style={{ height: 8 }} />
          <Button title="예매하기" onPress={handleReserveEmergency} />
          <View style={{ height: 8 }} />
          <Button title="홈으로" onPress={() => setActiveTab("home")} />
        </View>
      </View>
    );
  };

//  if (loading) {
//    return (
//      <View style={styles.container}>
//        <Text style={styles.title}>긴급 경로</Text>
//        <Text style={styles.subtitle}>{formatDeadlineKR(deadline)}</Text>
//        <View style={styles.center}>
//          <ActivityIndicator />
//        </View>
//      </View>
//    );
//  }
if (loading) {
  return (
    <View style={{ flex: 1 }}>
      <LoadingScreen />
    </View>
  );
}


  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>긴급 경로</Text>
        <Text style={styles.subtitle}>{formatDeadlineKR(deadline)}</Text>
        <Text style={{ color: "red", marginTop: 8 }}>{error}</Text>
      </View>
    );
  }

  if (selectedRoute) {
    return renderSummary();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>긴급 경로</Text>
      <Text style={styles.subtitle}>{formatDeadlineKR(deadline)}</Text>

      {routes.length === 0 ? (
        <Text style={{ marginTop: 8 }}>조건에 맞는 경로가 없습니다.</Text>
      ) : (
        <ScrollView style={{ marginTop: 8 }}>
          {routes.map((r, idx) => renderRouteItem(r, idx))}
        </ScrollView>
      )}
    </View>
  );
}

/* ==================== 기존 BookingScreen (직행 / 메뚜기) ==================== */
export default function BookingScreen({ setActiveTab, searchParams, user }) {
  // 🔹 긴급 모드인지 먼저 판단
  const isEmergency = searchParams?.isEmergency;

  // 🔸 긴급이면 전용 화면으로 바로 분기
  if (isEmergency) {
    return (
      <View style={styles.pageContainer}>
        <ScreenHeader
          title="트레:in(人)"
          showBackButton={true}
          onBackPress={() => setActiveTab("home")}
        />
        <EmergencyRouteScreen
          setActiveTab={setActiveTab}
          searchParams={searchParams}
          user={user}
        />
        <BottomNavigation activeTab="home" setActiveTab={setActiveTab} />
      </View>
    );
  }

  // ================= 긴급이 아닐 때: 기존 로직 유지 =================
  const [mode, setMode] = useState(null); // 'direct' | 'hopper'
  const [routeStops, setRouteStops] = useState([]);
  const [currentLegIndex, setCurrentLegIndex] = useState(0);
  const [step, setStep] = useState("init");
  const [stations, setStations] = useState([]);

  const [selectedTrains, setSelectedTrains] = useState([]); // 각 구간 열차
  const [selectedSeats, setSelectedSeats] = useState([]); // 각 구간 좌석

  // 경유지 단계
  const [waypointPhase, setWaypointPhase] = useState("first"); // 'first' | 'second' | 'third'
  const [wp1, setWp1] = useState(null);
  const [wp2, setWp2] = useState(null);
  const [wp3, setWp3] = useState(null);
  const [wp2Candidates, setWp2Candidates] = useState([]);
  const [wp3Candidates, setWp3Candidates] = useState([]);

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
          setWp3(null);
          setWp2Candidates([]);
          setWp3Candidates([]);

          const res = await fetch(`${API_BASE}/stations`);
          const data = await res.json();

          // 출발/도착 제외한 기본 역 목록
          const baseList = data.filter(
            (s) =>
              s.name !== searchParams.originName &&
              s.name !== searchParams.destName
          );

          const firstCandidates = [];

          // 출발지 → 해당 역 구간에 열차가 있는 역만 남기기
          for (const s of baseList) {
            const ok = await hasAnyTrain(originName, s.name, baseDate);
            if (ok) firstCandidates.push(s);
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
          setWaypointError("경유지 후보를 불러오는 중 오류가 발생했습니다.");
        } finally {
          setValidatingWaypoints(false);
        }
      }

      loadStations();
    }
  }, [searchParams]);

  const date = searchParams?.date;
  const passengers = searchParams?.passengers;

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
  const handleSelectFirstWaypoint = (name) => {
    selectFirstWaypoint(name, stations, searchParams, {
      setWaypointError,
      setValidatingWaypoints,
      setWp1,
      setWp2Candidates,
      setWaypointPhase,
    });
  };

  // 2번째 경유지 선택
  const handleSelectSecondWaypoint = (name) => {
    selectSecondWaypoint(name, stations, searchParams, wp1, {
      setWp2,
      setWaypointError,
      setValidatingWaypoints,
      setWp3Candidates,
      setWaypointPhase,
    });
  };

  // 최종 경유 조합 확정
  const confirmWaypoints = (waypointCount) => {
    let stops;
    if (waypointCount === 1) {
      stops = [searchParams.originName, wp1, searchParams.destName];
    } else if (waypointCount === 2) {
      stops = [searchParams.originName, wp1, wp2, searchParams.destName];
    } else if (waypointCount === 3) {
      stops = [searchParams.originName, wp1, wp2, wp3, searchParams.destName];
    } else {
      stops = [searchParams.originName, searchParams.destName];
    }

    setRouteStops(stops);
    setCurrentLegIndex(0);
    setStep("train");
  };

  /* ====== 예매 저장 로직 (기존) ====== */
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

  /* ====== 화면 분기 ====== */

  let body = null;

  if (!searchParams) {
    body = (
      <View style={styles.center}>
        <Text>홈 화면에서 먼저 조건을 선택해 주세요.</Text>
        <Button title="홈으로" onPress={() => setActiveTab("home")} />
      </View>
    );
  } else if (mode === "hopper" && step === "waypoints") {
    body = (
      <WaypointSelector
        phase={waypointPhase}
        searchParams={searchParams}
        wp1={wp1}
        wp2={wp2}
        wp3={wp3}
        stations={stations}
        wp2Candidates={wp2Candidates}
        wp3Candidates={wp3Candidates}
        validatingWaypoints={validatingWaypoints}
        waypointError={waypointError}
        onSelectFirstWaypoint={handleSelectFirstWaypoint}
        onSelectSecondWaypoint={handleSelectSecondWaypoint}
        onSelectThirdWaypoint={setWp3}
        onConfirmWithOne={() => confirmWaypoints(1)}
        onConfirmWithTwo={() => confirmWaypoints(2)}
        onConfirmWithThree={() => confirmWaypoints(3)}
      />
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
          baseDate={date}
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
  } else if (step === "summary") {
    body = (
      <BookingSummary
        mode={mode}
        date={date}
        passengers={passengers}
        legs={legs}
        selectedTrains={selectedTrains}
        selectedSeats={selectedSeats}
        onRetry={() => {
          setSelectedSeats([]);
          setSelectedTrains([]);
          if (mode === "direct") {
            setRouteStops([searchParams.originName, searchParams.destName]);
            setCurrentLegIndex(0);
            setStep("train");
          } else {
            setWaypointPhase("first");
            setWp1(null);
            setWp2(null);
            setWp3(null);
            setWp2Candidates([]);
            setWp3Candidates([]);
            setWaypointError("");
            setStep("waypoints");
          }
        }}
        onReserve={handleReserve}
        onGoHome={() => setActiveTab("home")}
      />
    );
  } else {
    body = (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  // ✅ 홈에서 booking으로 넘어온 직후: step이 아직 init이면 로딩 화면
  if (searchParams && step === "init") {
    return (
      <View style={styles.pageContainer}>
        <ScreenHeader
          title="트레:in(人)"
          showBackButton={true}
          onBackPress={() => setActiveTab("home")}
        />
        <LoadingScreen />
        <BottomNavigation activeTab="home" setActiveTab={setActiveTab} />
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
  pageContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    paddingTop: 16,
    paddingHorizontal: 24,
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  title: { fontSize: 22, fontWeight: "bold", marginBottom: 6 },
  subtitle: { fontSize: 14, marginBottom: 16, color: "#666" },
  sectionTitle: { fontSize: 16, fontWeight: "600" },

  // 긴급 경로 카드
  emRouteCard: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  emRouteCardBase: {
    backgroundColor: "#F5F5F5", // ✅ 기본 연회색
  },
  emRouteCardTop: {
    backgroundColor: "#FAF7E8", // ✅ Top3만 노란색
  },

  emRouteRank: {
    fontSize: 12,
    color: "#888",
    marginBottom: 4,
  },

  // ✅ 타임라인 정렬
  timelineRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 2,
    marginBottom: 6,
  },
  stationCol: {
    minWidth: 56,
    alignItems: "center",
  },
  stationName: {
    fontSize: 15,
    fontWeight: "600",
  },
  stationTime: {
    fontSize: 13,
    marginTop: 2,
    color: "#333",
  },
  arrowCol: {
    minWidth: 52,
    alignItems: "center",
    justifyContent: "center",
  },
  arrowText: {
    fontSize: 15,
    fontWeight: "600",
  },
  arrowSeat: {
    fontSize: 12,
    marginTop: 2,
    color: "#333",
  },

  emRouteMeta: {
    fontSize: 11,
    color: "#666",
  },
});
