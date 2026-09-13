import { useEffect, useState } from "react";
import {
  SIDO_LIST,
  fetchSidoAirQuality,
  gradePM10,
  gradePM25,
  getServiceKey,
} from "../lib/airkorea.js";
import "./AirKoreaWidget.css";

const DEFAULT_SIDO = "서울";

export default function AirKoreaWidget() {
  const [sidoIndex, setSidoIndex] = useState(SIDO_LIST.indexOf(DEFAULT_SIDO));
  const [status, setStatus] = useState("loading"); // loading | no-key | error | success
  const [data, setData] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const sido = SIDO_LIST[sidoIndex];

  useEffect(() => {
    if (!getServiceKey()) {
      setStatus("no-key");
      return;
    }

    const controller = new AbortController();
    setStatus("loading");

    fetchSidoAirQuality(sido, controller.signal)
      .then((result) => {
        setData(result);
        setStatus("success");
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        console.error("[AirKorea]", err);
        setErrorMsg(err.message || "");
        setStatus("error");
      });

    return () => controller.abort();
  }, [sido]);

  const cyclePrev = () =>
    setSidoIndex((i) => (i - 1 + SIDO_LIST.length) % SIDO_LIST.length);
  const cycleNext = () => setSidoIndex((i) => (i + 1) % SIDO_LIST.length);

  const pm10Grade = data ? gradePM10(data.pm10) : null;
  const pm25Grade = data ? gradePM25(data.pm25) : null;

  return (
    <div className="airkorea-strip">
      <div className="airkorea-strip-brand">
        <img
          className="airkorea-strip-logo"
          src="/images/airkorea.png"
          alt="AirKorea 에어코리아"
        />
        <span className="airkorea-strip-time">
          {status === "success" && data ? `${data.dataTime} 기준` : "실시간 측정정보"}
        </span>
      </div>

      <div className="airkorea-strip-region">{sido}</div>

      <div className="airkorea-strip-metrics">
        {status === "loading" && (
          <span className="airkorea-strip-msg">불러오는 중…</span>
        )}
        {status === "no-key" && (
          <span className="airkorea-strip-msg">API 키가 설정되지 않았습니다</span>
        )}
        {status === "error" && (
          <span className="airkorea-strip-msg">
            실시간 데이터를 불러오지 못했습니다
            {errorMsg && <em className="airkorea-strip-msg-detail"> ({errorMsg})</em>}
          </span>
        )}
        {status === "success" && data && (
          <>
            <span className="airkorea-strip-metric">
              미세먼지 <b>{data.pm10 != null ? data.pm10 : "-"}</b>
              <em>㎍/㎥</em>
              {pm10Grade && (
                <i className={`airkorea-strip-badge is-level-${pm10Grade.level}`}>
                  {pm10Grade.label}
                </i>
              )}
            </span>
            <span className="airkorea-strip-metric">
              초미세먼지 <b>{data.pm25 != null ? data.pm25 : "-"}</b>
              <em>㎍/㎥</em>
              {pm25Grade && (
                <i className={`airkorea-strip-badge is-level-${pm25Grade.level}`}>
                  {pm25Grade.label}
                </i>
              )}
            </span>
          </>
        )}
      </div>

      <div className="airkorea-strip-right">
        <div className="airkorea-strip-arrows">
          <button type="button" onClick={cyclePrev} aria-label="이전 지역">
            ▲
          </button>
          <button type="button" onClick={cycleNext} aria-label="다음 지역">
            ▼
          </button>
        </div>
        <a
          className="airkorea-strip-more"
          href="https://www.airkorea.or.kr/web/"
          target="_blank"
          rel="noreferrer"
        >
          전체보기
        </a>
      </div>
    </div>
  );
}
