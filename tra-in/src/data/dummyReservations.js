// 실제 DB user_tickets 테이블 구조에 맞춘 예약 데이터 (더미)
export const dummyReservations = [
  {
    id: 1,
    user_id: 1,
    ticket_id: 1,
    is_hopper: 1,
    origin_station: "서울",
    dest_station: "대전",
    departure_time: "2025-12-16 10:00:00",
    arrival_time: "2025-12-16 10:44:00",
    train_no: "D0910161",
    car_no: 1,
    seat_code: "8D"
  },
  {
    id: 2,
    user_id: 1,
    ticket_id: 1,
    is_hopper: 1,
    origin_station: "대전",
    dest_station: "부산",
    departure_time: "2025-12-16 14:30:00",
    arrival_time: "2025-12-16 16:30:00",
    train_no: "KTX186",
    car_no: 1,
    seat_code: "4B"
  }
];