const sample = [{"isHopper":true,"legs":[{"arrivalTime":"2025-12-16T10:44","carNo":1,"departureTime":"2025-12-16T10:00","destStation":"대전","originStation":"서울","seatCode":"8D","trainNo":"D0910161"},{"arrivalTime":"2025-12-16T16:30","carNo":1,"departureTime":"2025-12-16T14:30","destStation":"부산","originStation":"대전","seatCode":"4B","trainNo":"KTX186"}],"userId":1},{"isHopper":true,"legs":[{"arrivalTime":"2025-12-16T11:35","carNo":1,"departureTime":"2025-12-16T11:00","destStation":"울산","originStation":"부산","seatCode":"4A","trainNo":"KTX502"},{"arrivalTime":"2025-12-16T18:52","carNo":1,"departureTime":"2025-12-16T18:00","destStation":"전주","originStation":"울산","seatCode":"3A","trainNo":"D1320165"},{"arrivalTime":"2025-12-16T23:41","carNo":1,"departureTime":"2025-12-16T21:40","destStation":"대전","originStation":"전주","seatCode":"5C","trainNo":"D2010161"}],"userId":1},{"isHopper":true,"legs":[{"arrivalTime":"2025-12-17T09:13","carNo":1,"departureTime":"2025-12-17T08:00","destStation":"포항","originStation":"부산","seatCode":"1A","trainNo":"D0818174"},{"arrivalTime":"2025-12-17T15:39","carNo":3,"departureTime":"2025-12-17T14:00","destStation":"대구","originStation":"포항","seatCode":"1C","trainNo":"D1814174"},{"arrivalTime":"2025-12-17T23:05","carNo":1,"departureTime":"2025-12-17T21:20","destStation":"대전","originStation":"대구","seatCode":"4C","trainNo":"D1410173"}],"userId":1},{"isHopper":true,"legs":[{"arrivalTime":"2025-12-18T09:13","carNo":1,"departureTime":"2025-12-18T08:00","destStation":"포항","originStation":"부산","seatCode":"3A","trainNo":"D0818184"},{"arrivalTime":"2025-12-18T10:55","carNo":2,"departureTime":"2025-12-18T10:00","destStation":"대전","originStation":"포항","seatCode":"2B","trainNo":"D1810184"}],"userId":1},{"isHopper":true,"legs":[{"arrivalTime":"2025-12-16T09:13","carNo":1,"departureTime":"2025-12-16T08:00","destStation":"포항","originStation":"부산","seatCode":"2B","trainNo":"D0818164"},{"arrivalTime":"2025-12-16T11:51","carNo":2,"departureTime":"2025-12-16T10:36","destStation":"울산","originStation":"포항","seatCode":"1A","trainNo":"D1813163"},{"arrivalTime":"2025-12-16T15:32","carNo":1,"departureTime":"2025-12-16T14:20","destStation":"대전","originStation":"울산","seatCode":"1A","trainNo":"D1310161"}],"userId":1},{"isHopper":true,"legs":[{"arrivalTime":"2025-12-17T00:36","carNo":1,"departureTime":"2025-12-16T23:36","destStation":"포항","originStation":"부산","seatCode":"1A","trainNo":"D0818163"},{"arrivalTime":"2025-12-17T08:44","carNo":3,"departureTime":"2025-12-17T07:42","destStation":"울산","originStation":"포항","seatCode":"1B","trainNo":"D1813172"},{"arrivalTime":"2025-12-19T01:41","carNo":4,"departureTime":"2025-12-18T23:50","destStation":"대전","originStation":"울산","seatCode":"1C","trainNo":"D1310184"}],"userId":1}];

function formatReservations(reservations){
  const groups = Object.values(
    reservations.reduce((acc, reservation, idx) => {
      const ticketId = reservation.ticketId || reservation.ticket_id || idx;
      if (!acc[ticketId]) acc[ticketId] = { legs: [] };
      acc[ticketId].legs = (acc[ticketId].legs || []).concat(reservation.legs || []);
      return acc;
    }, {})
  );

  return groups.map((group, groupIdx) => {
    let legs = group.legs || [];
    legs = [...legs].sort((a,b) => (a.departureTime||'').localeCompare(b.departureTime||''));
    const departure = legs[0].originStation;
    const arrival = legs[legs.length-1].destStation;
    const departureTime = legs[0].departureTime ? legs[0].departureTime.slice(11,16) : '';
    const arrivalTime = legs[legs.length-1].arrivalTime ? legs[legs.length-1].arrivalTime.slice(11,16) : '';
    const transferStations = [];
    for (let i=0;i<legs.length-1;i++){
      if (!transferStations.includes(legs[i].destStation)) transferStations.push(legs[i].destStation);
    }
    const transfers = transferStations.map(station => {
      const legArrival = legs.find(l => l.destStation === station);
      const legDeparture = legs.find(l => l.originStation === station);
      const formatTime = dt => dt ? dt.slice(11,16) : '';
      const formatDate = dt => {
        if (!dt) return '';
        const d = dt.slice(0,10).replace(/-/g,'.');
        const dayKor = ['일','월','화','수','목','금','토'][new Date(dt).getDay()];
        return `${d}${dayKor ? ` (${dayKor})` : ''}`;
      };
      return {
        station,
        arrivalTime: legArrival && legArrival.arrivalTime ? formatTime(legArrival.arrivalTime) : '',
        arrivalDate: legArrival && legArrival.arrivalTime ? formatDate(legArrival.arrivalTime) : '',
        departureTime: legDeparture && legDeparture.departureTime ? formatTime(legDeparture.departureTime) : '',
        departureDate: legDeparture && legDeparture.departureTime ? formatDate(legDeparture.departureTime) : '',
        seat: legArrival && legArrival.seatCode,
        carNo: legArrival && legArrival.carNo,
      };
    });

    const depDate = legs[0].departureTime ? legs[0].departureTime.slice(0,10).replace(/-/g,'.') : '';
    const dayKor = legs[0].departureTime ? ['일','월','화','수','목','금','토'][new Date(legs[0].departureTime).getDay()] : '';
    return {
      id: group.ticketId || group.ticket_id || groupIdx,
      date: depDate + (dayKor ? ` (${dayKor})` : ''),
      departure, arrival, departureTime, arrivalTime,
      seat: legs[legs.length-1].seatCode,
      carNo: legs[legs.length-1].carNo,
      trainNo: legs[legs.length-1].trainNo,
      transfers
    };
  });
}

console.log(JSON.stringify(formatReservations(sample), null, 2));
