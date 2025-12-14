// 역/도시 이름 -> 도시 중심 좌표 (임시 하드코딩)
export const CITY_CENTER = {
  "서울": { latitude: 37.5665, longitude: 126.9780 },
  "대전": { latitude: 36.3504, longitude: 127.3845 },
  "대구": { latitude: 35.8714, longitude: 128.6014 },
  "부산": { latitude: 35.1796, longitude: 129.0756 },
  "광명": { latitude: 37.4772, longitude: 126.8664 },
  "울산": { latitude: 35.5384, longitude: 129.3114 },
  "포항": { latitude: 36.0190, longitude: 129.3435 },
  "강릉": { latitude: 37.7519, longitude: 128.8761 },
  "전주": { latitude: 35.8242, longitude: 127.1480 },
  "여수EXPO": { latitude: 34.7604, longitude: 127.6622 },
  "목포": { latitude: 34.8118, longitude: 126.3922 },
  "순천": { latitude: 34.9506, longitude: 127.4872 },
  "춘천": { latitude: 37.8813, longitude: 127.7298 },
  "청량리": { latitude: 37.5802, longitude: 127.0466 },
  "광주송정": { latitude: 35.1379, longitude: 126.7931 },
  "동대구": { latitude: 35.8784, longitude: 128.6286 },
  "김천구미": { latitude: 36.1286, longitude: 128.1112 },
  "오송": { latitude: 36.6200, longitude: 127.3270 },
  "익산": { latitude: 35.9483, longitude: 126.9578 },
};

export function getCityCenter(name) {
  return CITY_CENTER[name] ?? CITY_CENTER["서울"]; // fallback
}
