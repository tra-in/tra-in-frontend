import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Button,
  Alert,
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

/* ==================== 메인 화면 ==================== */
export default function BookingScreen({ setActiveTab, searchParams, user }) {
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

          // 출발지 → 해당 역 구간에 (오늘/내일 기준) 열차가 있는 역만 남기기
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

  /* ====== 예매 저장 로직 ====== */
  const handleReserve = async () => {
    if (!user || !user.id) {
      Alert.alert("오류", "로그인 정보가 없습니다.");
      return;
    }

    // 구간 + 선택된 열차/좌석을 묶어서 legs payload 생성
    const legsPayload = legs
      .map((leg, idx) => {
        const train = selectedTrains[idx];
        const seat = selectedSeats[idx];
        if (!train || !seat) return null;

        return {
          // 🔁 백엔드 DTO에 맞게 필드 이름 변경
          originStation: leg.from,
          destStation: leg.to,
          departureTime: train.departureTime, // "2025-12-16T06:30:00"
          arrivalTime: train.arrivalTime,
          trainNo: train.trainNo, // 🔁 trainName 대신 trainNo 하나만 전송
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
    // 메뚜기: 경유지 선택 (1번째 또는 2번째)
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
    // 열차 선택
    const from = currentLeg.from;
    const to = currentLeg.to;

    // 이전 구간의 도착시간을 after로
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
    // 좌석 선택
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
    // 요약
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
    // 안전용
    body = (
      <View style={styles.center}>
        <ActivityIndicator />
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
  // 바깥 전체
  pageContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  // 화면 본문(헤더 아래에 붙는 영역)
  container: {
    flex: 1,
    paddingTop: 16,
    paddingHorizontal: 24,
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  title: { fontSize: 22, fontWeight: "bold", marginBottom: 8 },
  subtitle: { fontSize: 14, marginBottom: 16, color: "#666" },
  sectionTitle: { fontSize: 16, fontWeight: "600" },
});
