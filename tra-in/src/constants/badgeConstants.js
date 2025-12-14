/**
 * 뱃지 관련 상수 및 타입 정의
 */

// 장소 타입
export const PLACE_TYPES = {
  RESTAURANT: "음식점",
  CAFE: "카페",
  ATTRACTION: "관광지",
  MARKET: "시장",
  CULTURE: "문화시설",
  SHOPPING: "쇼핑",
  ACCOMMODATION: "숙박",
  OTHER: "기타",
};

// 지역 정보 (시/도 > 구/군)
export const REGIONS = {
  SEOUL: {
    name: "서울특별시",
    code: "SEOUL",
  },
  BUSAN: {
    name: "부산광역시",
    code: "BUSAN",
  },
  DAEGU: {
    name: "대구광역시",
    code: "DAEGU",
  },
  INCHEON: {
    name: "인천광역시",
    code: "INCHEON",
  },
  GWANGJU: {
    name: "광주광역시",
    code: "GWANGJU",
  },
  DAEJEON: {
    name: "대전광역시",
    code: "DAEJEON",
  },
  ULSAN: {
    name: "울산광역시",
    code: "ULSAN",
  },
  SEJONG: {
    name: "세종특별자치시",
    code: "SEJONG",
  },
  GYEONGGI: {
    name: "경기도",
    code: "GYEONGGI",
  },
  GANGWON: {
    name: "강원특별자치도",
    code: "GANGWON",
  },
  CHUNGBUK: {
    name: "충청북도",
    code: "CHUNGBUK",
  },
  CHUNGNAM: {
    name: "충청남도",
    code: "CHUNGNAM",
  },
  JEONBUK: {
    name: "전북특별자치도",
    code: "JEONBUK",
  },
  JEONNAM: {
    name: "전라남도",
    code: "JEONNAM",
  },
  GYEONGBUK: {
    name: "경상북도",
    code: "GYEONGBUK",
  },
  GYEONGNAM: {
    name: "경상남도",
    code: "GYEONGNAM",
  },
  JEJU: {
    name: "제주특별자치도",
    code: "JEJU",
  },
};

// 지역 목록 (선택용)
export const REGION_LIST = ["전체", ...Object.values(REGIONS).map(region => region.name)];

/**
 * 지역구 이름으로 대도시/도 이름 추출
 * "대전 동구" -> "대전광역시"
 * "부산 해운대구" -> "부산광역시"
 */
export const getMainRegion = (districtName) => {
  if (!districtName) return null;
  
  const regionMap = {
    "서울": "서울특별시",
    "부산": "부산광역시",
    "대구": "대구광역시",
    "인천": "인천광역시",
    "광주": "광주광역시",
    "대전": "대전광역시",
    "울산": "울산광역시",
    "세종": "세종특별자치시",
    "경기": "경기도",
    "강원": "강원특별자치도",
    "충북": "충청북도",
    "충남": "충청남도",
    "전북": "전북특별자치도",
    "전남": "전라남도",
    "경북": "경상북도",
    "경남": "경상남도",
    "제주": "제주특별자치도",
  };
  
  for (const [key, value] of Object.entries(regionMap)) {
    if (districtName.includes(key)) {
      return value;
    }
  }
  
  return null;
};

// 뱃지(여행) 상태
export const BADGE_STATUS = {
  NOT_STARTED: "not_started", // 미시작
  IN_PROGRESS: "in_progress",  // 진행중
  COMPLETED: "completed",       // 완료
};

// 기본 여행 이름 (사용자가 이름을 지정하지 않은 경우)
export const DEFAULT_TRAVEL_NAME = "도장 깨기";

// 방문 상태
export const VISIT_STATUS = {
  VISITED: "visited",           // 방문 완료
  NOT_VISITED: "not_visited",   // 미방문
};

// 지역 정보 텍스트 (그거 아세요?)
export const REGION_INFO = {
  "대전 동구": "대전 동구 이사동의 500년 군묘는 유네스코 등재를 노리는 독특한 문화 유산이며, 소제동의 변화는 동구의 새로운 트렌디한 매력을 보여주는 비밀로 꼽힙니다.",
  "대전 중구": "대전 중구는 대전의 중심부로, 성심당과 으능정이거리 등 다양한 명소와 맛집이 밀집되어 있습니다.",
  "강원 춘천시": "춘천은 닭갈비와 막국수의 본고장이며, 남이섬과 소양강스카이워크 등 자연과 레저가 어우러진 도시입니다.",
  "부산 수영구": "수영구는 광안리해수욕장과 F1963 등 바다와 문화가 공존하는 부산의 핫플레이스입니다.",
  "대전 서구": "대전 서구는 자연과 도시가 조화를 이루는 지역으로, 갑천과 함께 여유로운 산책을 즐길 수 있습니다.",
  "부산 동구": "부산 동구는 부산의 역사와 전통이 살아있는 곳으로, 초량 이바구길과 168계단이 유명합니다.",
};

/**
 * 여러 지역을 포함한 여행인 경우 대표 지역명 생성
 * @param {Array<string>} regions - 지역 배열 ["대전 동구", "대전 중구"]
 * @returns {string} - "대전 동구 외 1곳" 형태
 */
export const getDisplayRegionName = (regions) => {
  if (!regions || regions.length === 0) return "";
  if (regions.length === 1) return regions[0];
  return `${regions[0]} 외 ${regions.length - 1}곳`;
};

/**
 * 여행 기간 표시 텍스트 생성
 * @param {string} startDate - 시작 날짜 (YYYY-MM-DD)
 * @param {string} endDate - 종료 날짜 (YYYY-MM-DD)
 * @returns {string} - "12월 15일 - 12월 17일" 형태
 */
export const getDateRangeText = (startDate, endDate) => {
  if (!startDate || !endDate) return "";
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  const startMonth = start.getMonth() + 1;
  const startDay = start.getDate();
  const endMonth = end.getMonth() + 1;
  const endDay = end.getDate();
  
  if (startMonth === endMonth && startDay === endDay) {
    return `${startMonth}월 ${startDay}일`;
  }
  
  return `${startMonth}월 ${startDay}일 - ${endMonth}월 ${endDay}일`;
};
