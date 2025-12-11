/**
 * 뱃지(여행) 및 장소 데이터 모델
 */

/**
 * 장소 데이터 구조
 * @typedef {Object} Place
 * @property {string} id - 장소 고유 ID
 * @property {string} name - 장소 이름 (제목)
 * @property {string} type - 장소 타입 (PLACE_TYPES 참조)
 * @property {string} businessHours - 영업 시간 ("11:00 - 21:00")
 * @property {string|null} closedDay - 휴무일 ("월요일", null)
 * @property {string|null} visitDate - 방문 날짜 ("12월 15일", null이면 미방문)
 * @property {boolean} visited - 방문 여부
 * @property {string|null} imageUrl - 장소 이미지 URL
 * @property {Object|null} location - 위치 정보 (위도, 경도)
 * @property {string|null} address - 주소
 * @property {string|null} phone - 전화번호
 */

/**
 * 뱃지(여행) 데이터 구조
 * @typedef {Object} Badge
 * @property {string} id - 뱃지 고유 ID
 * @property {string} title - 여행 이름 (사용자 지정, 기본값: "도장 깨기")
 * @property {Array<string>} regions - 여행 지역 배열 ["대전 동구", "대전 중구"]
 * @property {string} startDate - 여행 시작 날짜 (YYYY-MM-DD)
 * @property {string} endDate - 여행 종료 날짜 (YYYY-MM-DD)
 * @property {number} progress - 방문 완료한 장소 수
 * @property {number} total - 전체 장소 수
 * @property {Array<Place>} places - 여행 장소 목록
 * @property {string} status - 뱃지 상태 (BADGE_STATUS 참조)
 * @property {string|null} color - 프로그레스 바 색상 (없으면 자동 계산)
 * @property {Date} createdAt - 생성 시간
 * @property {Date|null} completedAt - 완료 시간
 */

/**
 * 장소 객체 생성
 */
export const createPlace = ({
  id,
  name,
  type,
  businessHours,
  closedDay = null,
  visitDate = null,
  visited = false,
  imageUrl = null,
  location = null,
  address = null,
  phone = null,
}) => ({
  id,
  name,
  type,
  businessHours,
  closedDay,
  visitDate,
  visited,
  imageUrl,
  location,
  address,
  phone,
});

/**
 * 뱃지(여행) 객체 생성
 */
export const createBadge = ({
  id,
  title = "도장 깨기",
  regions = [],
  startDate,
  endDate,
  places = [],
  status = "in_progress",
  color = null,
  createdAt = new Date(),
  completedAt = null,
}) => {
  const progress = places.filter(p => p.visited).length;
  const total = places.length;
  
  return {
    id,
    title,
    regions,
    startDate,
    endDate,
    progress,
    total,
    places,
    status,
    color,
    createdAt,
    completedAt,
  };
};

/**
 * 장소 방문 처리
 */
export const markPlaceAsVisited = (place, visitDate) => ({
  ...place,
  visited: true,
  visitDate,
});

/**
 * 뱃지 진행률 업데이트
 */
export const updateBadgeProgress = (badge) => {
  const progress = badge.places.filter(p => p.visited).length;
  const total = badge.places.length;
  const isCompleted = progress === total;
  
  return {
    ...badge,
    progress,
    total,
    status: isCompleted ? "completed" : badge.status,
    completedAt: isCompleted && !badge.completedAt ? new Date() : badge.completedAt,
  };
};
