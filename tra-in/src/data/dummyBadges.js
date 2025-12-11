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
  }),
  createPlace({
    id: "place-2",
    name: "성심당 본점",
    type: PLACE_TYPES.CAFE,
    businessHours: "08:00 - 22:00",
    closedDay: null,
    visitDate: "12월 14일",
    visited: true,
  }),
  createPlace({
    id: "place-3",
    name: "대전 소제동 카페거리",
    type: PLACE_TYPES.CAFE,
    businessHours: "10:00 - 22:00",
    closedDay: "매장별 상이",
    visitDate: "12월 13일",
    visited: true,
  }),
  createPlace({
    id: "place-4",
    name: "대전 이사동 군묘",
    type: PLACE_TYPES.ATTRACTION,
    businessHours: "상시 개방",
    closedDay: null,
    visitDate: null,
    visited: false,
  }),
  createPlace({
    id: "place-5",
    name: "대전역 관광안내소",
    type: PLACE_TYPES.ATTRACTION,
    businessHours: "09:00 - 18:00",
    closedDay: "일요일",
    visitDate: null,
    visited: false,
  }),
  createPlace({
    id: "place-6",
    name: "홍도깡통시장",
    type: PLACE_TYPES.MARKET,
    businessHours: "10:00 - 20:00",
    closedDay: "월요일",
    visitDate: null,
    visited: false,
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
