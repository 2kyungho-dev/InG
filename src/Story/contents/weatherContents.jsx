import React, { useEffect, useState } from "react";
import axios from "axios";

const STORAGE_KEY = "weatherDataCache";

const WeatherSlide = () => {
  const [weatherData, setWeatherData] = useState([]);
  const [popSeries, setPopSeries] = useState([]);
  const [error, setError] = useState(null);
  const [isRainyDay, setIsRainyDay] = useState(false);
  const [dayIcon, setDayIcon] = useState("☀️");

  useEffect(() => {
    const callJsonApi = async () => {
      try {
        const today = new Date().toISOString().split("T")[0].replace(/-/g, "");

        const cached = localStorage.getItem(STORAGE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
            if (parsed.date === today && parsed.data.length > 0) {
            setWeatherData(parsed.data);
            setIsRainyDay(parsed.isRainyDay);
            setDayIcon(parsed.dayIcon);
            return;
          }
        }

        // Fetch from backend Cloud Function
        const response = await axios.get("https://us-central1-ing-news.cloudfunctions.net/fetchWeatherData");
        const structuredData = response.data;

        setWeatherData(structuredData);

        const rainHours = structuredData.filter(d => ["1", "2", "3", "4"].includes(d.PTY));
        const rainRate = rainHours.length / structuredData.length;
        const isRainy = rainRate >= 0.2;
        setIsRainyDay(isRainy);

        let icon = "☀️";
        const skyValues = structuredData.map(d => d.SKY);
        const ptyValues = structuredData.map(d => d.PTY);
        const mostCommon = (arr) => arr.sort((a,b) =>
          arr.filter(v => v === a).length - arr.filter(v => v === b).length
        ).pop();

        const sky = mostCommon(skyValues);
        const pty = mostCommon(ptyValues);

        if (pty === "1") icon = "🌧️";
        else if (pty === "2") icon = "🌦️";
        else if (pty === "3") icon = "❄️";
        else if (pty === "4") icon = "🌧️";
        else if (sky === "4") icon = "☁️";
        else if (sky === "3") icon = "⛅";

        setDayIcon(icon);

        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          date: today,
          data: structuredData,
          isRainyDay: isRainy,
          dayIcon: icon,
        }));
      } catch (error) {
        console.error("API 호출 중 오류가 발생했습니다:", error);
        setError("기상 정보를 불러오는 데 실패했습니다.");
      }
    };

    callJsonApi();
  }, []);

  const getSkyDesc = (value) => {
    switch (value) {
      case "1": return "☀️ 맑음";
      case "3": return "⛅ 구름 많음";
      case "4": return "☁️ 흐림";
      default: return "정보 없음";
    }
  };

  const getPtyDesc = (value) => {
    switch (value) {
      case "0": return "없음";
      case "1": return "🌧️ 비";
      case "2": return "🌦️ 비/눈";
      case "3": return "❄️ 눈";
      case "4": return "🌧️ 소나기";
      default: return "정보 없음";
    }
  };

  const formatValue = (cat, val) => {
    if (cat === "SKY") return getSkyDesc(val);
    if (cat === "PTY") return getPtyDesc(val);
    if (cat === "TMP") return `${val}°C`;
    if (cat === "POP") return `${val}%`;
    return val;
  };

return (
    <div className="w-full h-full text-ing-text bg-ing-bg text-center p-6">
      <div className="p-3 rounded-xl w-full bg-ing-bg">
        <h2 className="text-xl font-bold text-ing-text mb-4">{dayIcon} 오늘의 날씨</h2>
        {error && <p className="text-red-500">{error}</p>}

        {weatherData.length > 0 && (
          <div className="mt-6">
            {isRainyDay && (
              <div className="mb-3 px-3 py-2 bg-ing-info border border-ing-border-muted text-ing-bg-light text-sm rounded">
                오늘은 비가 올 수 있어요. ☔ 우산을 꼭 챙기세요!
              </div>
            )}
            <h3 className="text-sm font-semibold text-ing-text-muted mb-2">시간대별 강수</h3>
            <div className="overflow-x-auto">
              <div 
              className="flex whitespace-nowrap gap-2 px-2"
              onClick={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              onTouchEnd={(e) => e.stopPropagation()}
              >
                {weatherData.map((d) => {
                  const hourNum = parseInt(d.hour, 10);

                  let icon = "☀️";

                  if (d.PTY === "1") icon = "🌧️";
                  else if (d.PTY === "2") icon = "🌦️";
                  else if (d.PTY === "3") icon = "❄️";
                  else if (d.PTY === "4") icon = "🌧️";
                  else {
                    if (d.SKY === "4") icon = "☁️";
                    else if (d.SKY === "3") icon = "⛅";
                    else if (hourNum >= 19 || hourNum < 6) icon = "🌙";
                  }

                  return (
                    <div key={`hourly-${d.time}`} className="bg-ing-bg-light border border-ing-border-muted rounded-md px-3 py-2 flex flex-col items-center text-sm min-w-[72px]">
                      <div className="text-xs text-ing-text-muted">{d.hour}시</div>
                      <div>{d.TMP}°C</div>
                      <div>{icon}</div>
                      <div className="text-ing-primary">{d.POP}%</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherSlide;