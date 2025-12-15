export function mapPreference(pref) {
  switch (pref) {
    case "RELAXATION":
      return "relaxation";
    case "ACTIVITY":
      return "activity";
    case "FOOD":
      return "food";
    case "SHOPPING":
      return "shopping";
    case "FOOD":
      return "food";
    default:
      return "nature";
  }
}

// 선호도 + 지역을 바탕
export function buildQuery(pref, region) {
  switch (pref) {
    case "RELAXATION":
      return `${region}에서 힐링할 수 있는 조용한 휴식 공간`;
    case "ACTIVITY":
      return `${region}에서 액티비티를 즐길 수 있는 체험, 레저, 놀이 명소`;
    case "FOOD":
      return `${region}에서 현지 맛집과 분위기 좋은 식당, 레스토랑, 카페, 디저트 카페`;
    case "SHOPPING":
      return `${region}에 있는 현지 시장, 상점, 백화점 등 쇼핑 공간`;
    case "CULTURE":
      return `${region}에서 방문할 수 있는 박물관, 미술관, 궁궐과 같은 문화 공간`;
    default:
      // default = NATURE
      return `${region} 근처의 바다나 산, 계곡, 공원과 같은 자연 속 힐링 공간`;
  }
}

// query(한국어 설명 문장)를 바탕으로 content_types 코드 배열을 도출
// 코드 목록:
// 12: 관광지, 14: 문화시설, 15: 축제공연행사, 25: 여행코스,
// 28: 레포츠, 32: 숙박, 38: 쇼핑, 39: 음식점
export function contentTypesFromQuery(query) {
  const q = (query || "").toLowerCase();
  const types = new Set();

  // 음식 관련
  if (
    q.includes("맛집") ||
    q.includes("식당") ||
    q.includes("레스토랑") ||
    q.includes("카페") ||
    q.includes("디저트")
  ) {
    types.add("39"); // 음식점
  }

  // 문화 관련
  if (
    q.includes("박물관") ||
    q.includes("미술관") ||
    q.includes("궁궐") ||
    q.includes("문화")
  ) {
    types.add("14"); // 문화시설
  }

  // 쇼핑 관련
  if (
    q.includes("쇼핑") ||
    q.includes("시장") ||
    q.includes("상점") ||
    q.includes("백화점")
  ) {
    types.add("38"); // 쇼핑
  }

  // 액티비티/레저 관련
  if (
    q.includes("액티비티") ||
    q.includes("레저") ||
    q.includes("체험") ||
    q.includes("놀이") ||
    q.includes("레포츠")
  ) {
    types.add("28"); // 레포츠
    types.add("12"); // 관광지도 함께 포함
  }

  // 자연 힐링/관광
  if (
    q.includes("자연") ||
    q.includes("바다") ||
    q.includes("산") ||
    q.includes("계곡") ||
    q.includes("공원") ||
    q.includes("힐링")
  ) {
    types.add("12"); // 관광지
  }

  // 숙박 키워드가 있을 경우
  if (q.includes("숙박") || q.includes("호텔") || q.includes("펜션")) {
    types.add("32"); // 숙박
  }

  // 여행코스 언급 시
  if (q.includes("여행코스") || q.includes("코스") || q.includes("루트")) {
    types.add("25"); // 여행코스
  }

  // 축제/공연/행사
  if (q.includes("축제") || q.includes("공연") || q.includes("행사")) {
    types.add("15");
  }

  // 최소 기본값 보장
  if (types.size === 0) {
    return ["12", "39"]; // 기본: 관광지 + 음식점
  }

  return Array.from(types);
}
