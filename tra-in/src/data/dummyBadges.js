/**
 * 뱃지(여행) 더미 데이터
 * TODO: 향후 API 연동시 제거
 */

import { createBadge, createPlace } from "../models/badgeModels";
import { PLACE_TYPES } from "../constants/badgeConstants";

// 더미 장소 데이터
const dummyPlaces = [
  createPlace({
    id: "place-1",
    name: "톤쇼우 대전 동구점",
    type: PLACE_TYPES.RESTAURANT,
    businessHours: "11:00 - 21:00",
    closedDay: "격주 월요일",
    visitDate: "12월 15일",
    visited: true,
    imageUrl: "https://picsum.photos/200/150?random=0",
    images: [
      "https://picsum.photos/133/167?random=0",
      "https://picsum.photos/85/81?random=1",
      "https://picsum.photos/85/81?random=2",
      "https://picsum.photos/85/81?random=3",
      "https://picsum.photos/85/81?random=4",
    ],
    address: {
      new: "대전광역시 동구 가양동 578-33",
      old: "(도평동) 대전 동구 대성2길 35"
    },
    phone: "010 - 2113 - 2945",
    weeklyHours: [
      { day: "월(12/15)", hours: "11:00 ~ 21:30", lastOrder: "20:30 라스트오더" },
      { day: "화(12/16)", hours: "11:00 ~ 21:30", lastOrder: "20:30 라스트오더" },
      { day: "수(12/17)", hours: "11:00 ~ 21:30", lastOrder: "20:30 라스트오더" },
      { day: "목(12/18)", hours: "11:00 ~ 21:30", lastOrder: "20:30 라스트오더" },
      { day: "금(12/19)", hours: "11:00 ~ 21:30", lastOrder: "20:30 라스트오더" },
      { day: "토(12/20)", hours: "11:00 ~ 21:30", lastOrder: "20:30 라스트오더" },
      { day: "일(12/21)", hours: "11:00 ~ 21:30", lastOrder: "20:30 라스트오더" },
    ],
  }),
  createPlace({
    id: "place-2",
    name: "성심당 본점",
    type: PLACE_TYPES.CAFE,
    businessHours: "08:00 - 22:00",
    closedDay: null,
    visitDate: "12월 14일",
    visited: true,
    imageUrl: "https://picsum.photos/200/150?random=5",
    images: [
      "https://picsum.photos/133/167?random=5",
      "https://picsum.photos/85/81?random=6",
      "https://picsum.photos/85/81?random=7",
      "https://picsum.photos/85/81?random=8",
      "https://picsum.photos/85/81?random=9",
    ],
    address: {
      new: "대전광역시 중구 은행동 145",
      old: "대전 중구 대종로480번길 15"
    },
    phone: "042 - 253 - 0393",
    weeklyHours: [
      { day: "월(12/15)", hours: "08:00 ~ 22:00", lastOrder: "21:30 라스트오더" },
      { day: "화(12/16)", hours: "08:00 ~ 22:00", lastOrder: "21:30 라스트오더" },
      { day: "수(12/17)", hours: "08:00 ~ 22:00", lastOrder: "21:30 라스트오더" },
      { day: "목(12/18)", hours: "08:00 ~ 22:00", lastOrder: "21:30 라스트오더" },
      { day: "금(12/19)", hours: "08:00 ~ 22:00", lastOrder: "21:30 라스트오더" },
      { day: "토(12/20)", hours: "08:00 ~ 22:00", lastOrder: "21:30 라스트오더" },
      { day: "일(12/21)", hours: "08:00 ~ 22:00", lastOrder: "21:30 라스트오더" },
    ],
  }),
  createPlace({
    id: "place-3",
    name: "대전 소제동 카페거리",
    type: PLACE_TYPES.CAFE,
    businessHours: "10:00 - 22:00",
    closedDay: "매장별 상이",
    visitDate: "12월 13일",
    visited: true,
    imageUrl: "https://picsum.photos/200/150?random=10",
    images: [
      "https://picsum.photos/133/167?random=10",
      "https://picsum.photos/85/81?random=11",
      "https://picsum.photos/85/81?random=12",
      "https://picsum.photos/85/81?random=13",
      "https://picsum.photos/85/81?random=14",
    ],
    address: {
      new: "대전광역시 중구 소제동",
      old: "대전 중구 소제동 일대"
    },
    phone: "042 - 606 - 6395",
    weeklyHours: [
      { day: "월(12/15)", hours: "10:00 ~ 22:00", lastOrder: "21:30 라스트오더" },
      { day: "화(12/16)", hours: "10:00 ~ 22:00", lastOrder: "21:30 라스트오더" },
      { day: "수(12/17)", hours: "10:00 ~ 22:00", lastOrder: "21:30 라스트오더" },
      { day: "목(12/18)", hours: "10:00 ~ 22:00", lastOrder: "21:30 라스트오더" },
      { day: "금(12/19)", hours: "10:00 ~ 22:00", lastOrder: "21:30 라스트오더" },
      { day: "토(12/20)", hours: "10:00 ~ 22:00", lastOrder: "21:30 라스트오더" },
      { day: "일(12/21)", hours: "매장별 상이", lastOrder: "" },
    ],
  }),
  createPlace({
    id: "place-4",
    name: "대전 이사동 군묘",
    type: PLACE_TYPES.ATTRACTION,
    businessHours: "상시 개방",
    closedDay: null,
    visitDate: null,
    visited: false,
    imageUrl: "https://picsum.photos/200/150?random=15",
    images: [
      "https://picsum.photos/133/167?random=15",
      "https://picsum.photos/85/81?random=16",
      "https://picsum.photos/85/81?random=17",
      "https://picsum.photos/85/81?random=18",
      "https://picsum.photos/85/81?random=19",
    ],
    address: {
      new: "대전광역시 대덕구 이사동",
      old: "대전 대덕구 이사동 산3-4"
    },
    phone: "042 - 608 - 6394",
    weeklyHours: [
      { day: "월(12/15)", hours: "상시 개방", lastOrder: "" },
      { day: "화(12/16)", hours: "상시 개방", lastOrder: "" },
      { day: "수(12/17)", hours: "상시 개방", lastOrder: "" },
      { day: "목(12/18)", hours: "상시 개방", lastOrder: "" },
      { day: "금(12/19)", hours: "상시 개방", lastOrder: "" },
      { day: "토(12/20)", hours: "상시 개방", lastOrder: "" },
      { day: "일(12/21)", hours: "상시 개방", lastOrder: "" },
    ],
  }),
  createPlace({
    id: "place-5",
    name: "대전역 관광안내소",
    type: PLACE_TYPES.ATTRACTION,
    businessHours: "09:00 - 18:00",
    closedDay: "일요일",
    visitDate: null,
    visited: false,
    imageUrl: "https://picsum.photos/200/150?random=20",
    images: [
      "https://picsum.photos/133/167?random=20",
      "https://picsum.photos/85/81?random=21",
      "https://picsum.photos/85/81?random=22",
      "https://picsum.photos/85/81?random=23",
      "https://picsum.photos/85/81?random=24",
    ],
    address: {
      new: "대전광역시 동구 중앙로 215",
      old: "대전 동구 정동 1-1"
    },
    phone: "042 - 221 - 1905",
    weeklyHours: [
      { day: "월(12/15)", hours: "09:00 ~ 18:00", lastOrder: "" },
      { day: "화(12/16)", hours: "09:00 ~ 18:00", lastOrder: "" },
      { day: "수(12/17)", hours: "09:00 ~ 18:00", lastOrder: "" },
      { day: "목(12/18)", hours: "09:00 ~ 18:00", lastOrder: "" },
      { day: "금(12/19)", hours: "09:00 ~ 18:00", lastOrder: "" },
      { day: "토(12/20)", hours: "09:00 ~ 18:00", lastOrder: "" },
      { day: "일(12/21)", hours: "휴무", lastOrder: "" },
    ],
  }),
  createPlace({
    id: "place-6",
    name: "홍도깡통시장",
    type: PLACE_TYPES.MARKET,
    businessHours: "10:00 - 20:00",
    closedDay: "월요일",
    visitDate: null,
    visited: false,
    imageUrl: "https://picsum.photos/200/150?random=25",
    images: [
      "https://picsum.photos/133/167?random=25",
      "https://picsum.photos/85/81?random=26",
      "https://picsum.photos/85/81?random=27",
      "https://picsum.photos/85/81?random=28",
      "https://picsum.photos/85/81?random=29",
    ],
    address: {
      new: "대전광역시 동구 판암동 584",
      old: "대전 동구 판암로 265"
    },
    phone: "042 - 624 - 1905",
    weeklyHours: [
      { day: "월(12/15)", hours: "휴무", lastOrder: "" },
      { day: "화(12/16)", hours: "10:00 ~ 20:00", lastOrder: "" },
      { day: "수(12/17)", hours: "10:00 ~ 20:00", lastOrder: "" },
      { day: "목(12/18)", hours: "10:00 ~ 20:00", lastOrder: "" },
      { day: "금(12/19)", hours: "10:00 ~ 20:00", lastOrder: "" },
      { day: "토(12/20)", hours: "10:00 ~ 20:00", lastOrder: "" },
      { day: "일(12/21)", hours: "10:00 ~ 20:00", lastOrder: "" },
    ],
  }),
];

/**
 * 더미 뱃지(여행) 목록 생성
 */
export const generateDummyBadges = () => {
  return [
    // 완료된 여행
    // 대전 중구 완료 뱃지
    createBadge({
      id: "badge-daejeon-junggu",
      title: "성심당의 도시 탐방",
      description: "대전 중구의 명소와 맛집을 모두 방문하면 획득!",
      regions: ["대전 중구"],
      startDate: "2025-12-14",
      endDate: "2025-12-16",
      imageUrl: require('../../assets/daejeon_joonggu.png'),
      places: [
        createPlace({ id: "junggu-1", name: "성심당", type: PLACE_TYPES.CAFE, visited: true, visitDate: "1월 10일", imageUrl: "", address: { new: "대전 중구 은행동 145" }, businessHours: "08:00-22:00" }),
        createPlace({ id: "junggu-2", name: "대전역", type: PLACE_TYPES.STATION, visited: true, visitDate: "1월 10일", imageUrl: "", address: { new: "대전 중구 중앙로 215" }, businessHours: "00:00-24:00" }),
        createPlace({ id: "junggu-3", name: "으능정이거리", type: PLACE_TYPES.SPOT, visited: true, visitDate: "1월 10일", imageUrl: "", address: { new: "대전 중구 은행동" }, businessHours: "상시" }),
        createPlace({ id: "junggu-4", name: "대전시립미술관", type: PLACE_TYPES.MUSEUM, visited: true, visitDate: "1월 11일", imageUrl: "", address: { new: "대전 중구 대종로 373" }, businessHours: "10:00-19:00" }),
        createPlace({ id: "junggu-5", name: "대전중앙시장", type: PLACE_TYPES.MARKET, visited: true, visitDate: "1월 11일", imageUrl: "", address: { new: "대전 중구 중앙로 200" }, businessHours: "09:00-21:00" }),
        createPlace({ id: "junggu-6", name: "뿌리공원", type: PLACE_TYPES.PARK, visited: true, visitDate: "1월 11일", imageUrl: "", address: { new: "대전 중구 뿌리공원로 79" }, businessHours: "06:00-22:00" }),
        createPlace({ id: "junggu-7", name: "대전근현대사전시관", type: PLACE_TYPES.MUSEUM, visited: true, visitDate: "1월 12일", imageUrl: "", address: { new: "대전 중구 중앙로 101" }, businessHours: "09:00-18:00" }),
        createPlace({ id: "junggu-8", name: "대흥동 카페", type: PLACE_TYPES.CAFE, visited: true, visitDate: "1월 12일", imageUrl: "", address: { new: "대전 중구 대흥동" }, businessHours: "상시" }),
      ],
      status: "completed",
    }),

    // 강원 춘천시 완료 뱃지
    createBadge({
      id: "badge-gangwon-chuncheon",
      title: "춘천은 역시 감자빵",
      description: "강원 춘천의 자연과 문화를 모두 경험하면 획득!",
      regions: ["강원 춘천시"],
      startDate: "2025-12-17",
      endDate: "2025-12-19",
      imageUrl: require('../../assets/gangwon_chooncheon.png'),
      places: [
        createPlace({ id: "chuncheon-1", name: "남이섬", type: PLACE_TYPES.SPOT, visited: true, visitDate: "2월 1일", imageUrl: "", address: { new: "강원 춘천시 남이섬길 1" }, businessHours: "07:30-21:40" }),
        createPlace({ id: "chuncheon-2", name: "소양강스카이워크", type: PLACE_TYPES.SPOT, visited: true, visitDate: "2월 1일", imageUrl: "", address: { new: "강원 춘천시 근화동 37" }, businessHours: "10:00-18:00" }),
        createPlace({ id: "chuncheon-3", name: "춘천명동거리", type: PLACE_TYPES.SPOT, visited: true, visitDate: "2월 1일", imageUrl: "", address: { new: "강원 춘천시 중앙로 68" }, businessHours: "상시" }),
        createPlace({ id: "chuncheon-4", name: "공지천공원", type: PLACE_TYPES.PARK, visited: true, visitDate: "2월 2일", imageUrl: "", address: { new: "강원 춘천시 공지로 124" }, businessHours: "상시" }),
        createPlace({ id: "chuncheon-5", name: "강촌레일바이크", type: PLACE_TYPES.ACTIVITY, visited: true, visitDate: "2월 2일", imageUrl: "", address: { new: "강원 춘천시 신동면 김유정로 1383" }, businessHours: "09:00-18:00" }),
        createPlace({ id: "chuncheon-6", name: "제이드가든", type: PLACE_TYPES.PARK, visited: true, visitDate: "2월 2일", imageUrl: "", address: { new: "강원 춘천시 남산면 햇골길 80" }, businessHours: "09:00-19:00" }),
        createPlace({ id: "chuncheon-7", name: "김유정문학촌", type: PLACE_TYPES.MUSEUM, visited: true, visitDate: "2월 3일", imageUrl: "", address: { new: "강원 춘천시 신동면 김유정로 1430-14" }, businessHours: "09:30-17:30" }),
        createPlace({ id: "chuncheon-8", name: "춘천막국수골목", type: PLACE_TYPES.RESTAURANT, visited: true, visitDate: "2월 3일", imageUrl: "", address: { new: "강원 춘천시 중앙로 77" }, businessHours: "10:00-22:00" }),
      ],
      status: "completed",
    }),

    // 부산 수영구 완료 뱃지
    createBadge({
      id: "badge-busan-suyeonggu",
      title: "광안리 가즈아",
      description: "부산 수영구의 바다와 핫플을 모두 방문하면 획득!",
      regions: ["부산 수영구"],
      startDate: "2025-12-20",
      endDate: "2025-12-22",
      imageUrl: require('../../assets/busan_sooyeonggu.png'),
      places: [
        createPlace({ id: "suyeonggu-1", name: "광안리해수욕장", type: PLACE_TYPES.SPOT, visited: true, visitDate: "3월 5일", imageUrl: "", address: { new: "부산 수영구 광안해변로 219" }, businessHours: "상시" }),
        createPlace({ id: "suyeonggu-2", name: "민락수변공원", type: PLACE_TYPES.PARK, visited: true, visitDate: "3월 5일", imageUrl: "", address: { new: "부산 수영구 민락동 113-20" }, businessHours: "상시" }),
        createPlace({ id: "suyeonggu-3", name: "수영사적공원", type: PLACE_TYPES.PARK, visited: true, visitDate: "3월 5일", imageUrl: "", address: { new: "부산 수영구 수영로521번길 41" }, businessHours: "09:00-18:00" }),
        createPlace({ id: "suyeonggu-4", name: "F1963", type: PLACE_TYPES.SPOT, visited: true, visitDate: "3월 6일", imageUrl: "", address: { new: "부산 수영구 구락로123번길 20" }, businessHours: "10:00-22:00" }),
        createPlace({ id: "suyeonggu-5", name: "광안대교 전망대", type: PLACE_TYPES.SPOT, visited: true, visitDate: "3월 6일", imageUrl: "", address: { new: "부산 수영구 민락동" }, businessHours: "상시" }),
        createPlace({ id: "suyeonggu-6", name: "남천동 카페거리", type: PLACE_TYPES.CAFE, visited: true, visitDate: "3월 6일", imageUrl: "", address: { new: "부산 수영구 남천동" }, businessHours: "상시" }),
        createPlace({ id: "suyeonggu-7", name: "수영팔도시장", type: PLACE_TYPES.MARKET, visited: true, visitDate: "3월 7일", imageUrl: "", address: { new: "부산 수영구 수영로 725" }, businessHours: "09:00-21:00" }),
        createPlace({ id: "suyeonggu-8", name: "요트경기장", type: PLACE_TYPES.SPOT, visited: true, visitDate: "3월 7일", imageUrl: "", address: { new: "부산 수영구 민락동 168-4" }, businessHours: "09:00-18:00" }),
      ],
      status: "completed",
    }),
    
    // 진행 중인 여행들
    createBadge({
      id: "badge-2",
      title: "도장 깨기",
      regions: ["대전 동구", "대전 중구"],
      startDate: "2024-12-15",
      endDate: "2024-12-17",
      places: dummyPlaces.map((p, i) => ({ ...p, id: `2-${i}`, visited: i < 4 })),
    }),
    
    createBadge({
      id: "badge-3",
      title: "가족 여행",
      regions: ["대전 서구"],
      startDate: "2024-12-20",
      endDate: "2024-12-22",
      places: dummyPlaces.map((p, i) => ({ ...p, id: `3-${i}`, visited: i < 3 })),
    }),
    
    createBadge({
      id: "badge-4",
      title: "도장 깨기",
      regions: ["대전 유성구"],
      startDate: "2024-12-25",
      endDate: "2024-12-27",
      places: dummyPlaces.map((p, i) => ({ ...p, id: `4-${i}`, visited: i < 2 })),
    }),
    
    // 미시작 여행들
    ...Array.from({ length: 8 }, (_, i) => 
      createBadge({
        id: `badge-${i + 5}`,
        title: "도장 깨기",
        regions: ["대전 대덕구"],
        startDate: "2025-01-01",
        endDate: "2025-01-03",
        places: dummyPlaces.map((p, j) => ({ ...p, id: `${i + 5}-${j}`, visited: false, visitDate: null })),
        status: "not_started",
      })
    ),
  ];
};
