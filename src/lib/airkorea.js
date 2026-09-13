// 에어코리아(한국환경공단 운영) 시도별 실시간 측정정보 조회 API.
// https://www.data.go.kr 공공데이터포털에서 "한국환경공단_에어코리아_대기오염정보" 서비스를
// 신청하면 발급되는 서비스키가 필요하다.
//
// .env 파일에 다음과 같이 키를 넣으면 자동으로 연결된다:
//   VITE_AIRKOREA_SERVICE_KEY=발급받은_서비스키
//
// 주의: apis.data.go.kr 엔드포인트는 브라우저(CORS)에서 직접 호출이 차단될 수 있다.
// 그 경우 별도의 서버/서버리스 프록시를 통해 우회해야 한다 (이 프로젝트는 프론트엔드만
// 존재하므로 우선 클라이언트에서 직접 호출을 시도하고, 실패하면 안내 메시지를 보여준다).

const ENDPOINT =
  "https://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty";

export const SIDO_LIST = [
  "서울",
  "부산",
  "대구",
  "인천",
  "광주",
  "대전",
  "울산",
  "세종",
  "경기",
  "강원",
  "충북",
  "충남",
  "전북",
  "전남",
  "경북",
  "경남",
  "제주",
];

export function getServiceKey() {
  return import.meta.env.VITE_AIRKOREA_SERVICE_KEY;
}

// 통합대기환경지수 등급 기준 (환경부 고시 기준값, 임의 생성 데이터가 아니다)
export function gradePM10(value) {
  if (value == null) return null;
  if (value <= 30) return { label: "좋음", level: 1 };
  if (value <= 80) return { label: "보통", level: 2 };
  if (value <= 150) return { label: "나쁨", level: 3 };
  return { label: "매우나쁨", level: 4 };
}

export function gradePM25(value) {
  if (value == null) return null;
  if (value <= 15) return { label: "좋음", level: 1 };
  if (value <= 35) return { label: "보통", level: 2 };
  if (value <= 75) return { label: "나쁨", level: 3 };
  return { label: "매우나쁨", level: 4 };
}

// sidoName 지역의 첫 번째 유효한 측정소 데이터를 반환한다.
export async function fetchSidoAirQuality(sidoName, signal) {
  const serviceKey = getServiceKey();
  if (!serviceKey) {
    const err = new Error("MISSING_KEY");
    err.code = "MISSING_KEY";
    throw err;
  }

  const url = new URL(ENDPOINT);
  url.searchParams.set("serviceKey", serviceKey);
  url.searchParams.set("returnType", "json");
  url.searchParams.set("numOfRows", "50");
  url.searchParams.set("pageNo", "1");
  url.searchParams.set("sidoName", sidoName);
  url.searchParams.set("ver", "1.0");

  const res = await fetch(url.toString(), { signal });
  if (!res.ok) {
    const err = new Error(`HTTP_${res.status}`);
    err.code = "FETCH_FAILED";
    throw err;
  }

  const raw = await res.text();
  let json;
  try {
    json = JSON.parse(raw);
  } catch {
    // 서비스키 미승인/오류 시 JSON 대신 XML 오류 응답이 오는 경우가 있다.
    const msgMatch = raw.match(/<returnAuthMsg>(.*?)<\/returnAuthMsg>/) ||
      raw.match(/<errMsg>(.*?)<\/errMsg>/);
    const err = new Error(msgMatch ? msgMatch[1] : "INVALID_RESPONSE");
    err.code = "API_ERROR";
    throw err;
  }

  const resultCode = json?.response?.header?.resultCode;
  if (resultCode && resultCode !== "00") {
    const err = new Error(json?.response?.header?.resultMsg || `RESULT_${resultCode}`);
    err.code = "API_ERROR";
    throw err;
  }

  const items = json?.response?.body?.items;
  if (!Array.isArray(items) || items.length === 0) {
    const err = new Error("NO_DATA");
    err.code = "NO_DATA";
    throw err;
  }

  const item = items.find((it) => it.pm10Value !== "-" && it.pm25Value !== "-") ?? items[0];

  const pm10 = Number(item.pm10Value);
  const pm25 = Number(item.pm25Value);

  return {
    sidoName,
    stationName: item.stationName,
    dataTime: item.dataTime,
    pm10: Number.isFinite(pm10) ? pm10 : null,
    pm25: Number.isFinite(pm25) ? pm25 : null,
  };
}
