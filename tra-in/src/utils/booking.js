import { API_BASE } from "../config/api";

/** 날짜 문자열(YYYY-MM-DD)을 하루 뒤로 */
export function plusOneDay(dateStr) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

/** 한 번만 조회 (특정 날짜 + after 옵션) */
export function searchOnce(origin, dest, date, after) {
  const params = new URLSearchParams({ origin, dest, date });
  if (after) params.append("after", after);
  return fetch(`${API_BASE}/trains?${params.toString()}`).then((res) =>
    res.json()
  );
}

/** origin→dest 구간에서 오늘 or 내일 중 하루라도 열차가 있는지 */
export async function hasAnyTrain(origin, dest, baseDate) {
  // 오늘
  let data = await searchOnce(origin, dest, baseDate, null);
  if (Array.isArray(data) && data.length > 0) return true;

  // 내일
  const nextDate = plusOneDay(baseDate);
  data = await searchOnce(origin, dest, nextDate, null);
  return Array.isArray(data) && data.length > 0;
}

/** 날짜 문자열을 MM/DD 포맷으로 변환 */
export function formatMonthDay(dateTimeStr) {
  if (!dateTimeStr) return "";
  const month = dateTimeStr.slice(5, 7); // "12"
  const day = dateTimeStr.slice(8, 10); // "16"
  return `${month}/${day}`; // "12/16"
}
