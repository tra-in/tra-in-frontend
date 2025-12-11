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
    createBadge({
      id: "badge-1",
      title: "동구 먹방 투어",
      regions: ["대전 동구"],
      startDate: "2024-12-01",
      endDate: "2024-12-03",
      places: dummyPlaces.map((p, i) => ({ ...p, id: `1-${i}`, visited: true, visitDate: "12월 15일" })),
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
