export function mapPreference(pref) {
  switch (pref) {
    case "HEALING":   return "nature";
    case "ACTIVITY":  return "activity";
    case "FOOD":      return "food";
    default:          return "nature"; // 임시 기본값
  }
}

// 선호도 + 지역을 바탕
export function buildQuery(pref, region) {
  switch (pref) {
    case "HEALING":
      return `${region}에서 힐링할 수 있는 잔잔하고 이쁜 산책하기 좋은 공원`;
    case "ACTIVITY":
      return `${region}에서 액티비티를 즐길 수 있는 체험/레저 명소`;
    case "FOOD":
      return `${region}에서 현지 맛집과 분위기 좋은 식당`;
    default:
      return `${region} 여행 추천`;
  }
}
