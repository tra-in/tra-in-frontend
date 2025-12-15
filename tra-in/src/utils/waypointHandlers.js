import { hasAnyTrain } from "../utils/booking";

/**
 * 첫 번째 경유지 선택 핸들러
 */
export async function selectFirstWaypoint(
  name,
  stations,
  searchParams,
  callbacks
) {
  const {
    setWaypointError,
    setValidatingWaypoints,
    setWp1,
    setWp2Candidates,
    setWaypointPhase,
  } = callbacks;

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

      const okToDest = await hasAnyTrain(
        s.name,
        searchParams.destName,
        baseDate
      );
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
}

/**
 * 두 번째 경유지 선택 핸들러
 */
export async function selectSecondWaypoint(
  name,
  stations,
  searchParams,
  wp1,
  callbacks
) {
  const {
    setWp2,
    setWaypointError,
    setValidatingWaypoints,
    setWp3Candidates,
    setWaypointPhase,
  } = callbacks;

  setWp2(name);
  setWaypointError("");
  setValidatingWaypoints(true);

  try {
    const baseDate = searchParams.date;
    const candidates = [];

    for (const s of stations) {
      if (
        s.name === searchParams.originName ||
        s.name === searchParams.destName ||
        s.name === wp1 ||
        s.name === name
      ) {
        continue;
      }

      const okFromWp2 = await hasAnyTrain(name, s.name, baseDate);
      if (!okFromWp2) continue;

      const okToDest = await hasAnyTrain(
        s.name,
        searchParams.destName,
        baseDate
      );
      if (!okToDest) continue;

      candidates.push(s.name);
    }

    setWp3Candidates(candidates);

    if (candidates.length === 0) {
      setWaypointError(
        `선택한 경유지(${name})에서 갈 수 있고 도착지까지 이어지는 역이 없습니다. 2번째 경유지 없이 진행하거나 다른 경유지를 선택해 주세요.`
      );
      setWaypointPhase("second");
    } else {
      setWaypointPhase("third");
    }
  } catch (e) {
    console.error("WP2 선택 처리 오류", e);
    setWaypointError("경유지 후보를 계산하는 중 오류가 발생했습니다.");
    setWaypointPhase("second");
  } finally {
    setValidatingWaypoints(false);
  }
}
