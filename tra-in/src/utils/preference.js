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
