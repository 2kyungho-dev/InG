import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import CandleChart from './CandleChart.jsx'

const KoreaStockKRX = ({ itemName }) => {
  const [stockData, setStockData] = useState(null);
  const [error, setError] = useState(null);

  const API_KEY = "KnHS3+8STMtO36SZ6ZekxLHJSeLvmKq3JCYCbDorrPiEOxob/P2Ao+fUyHC1hVFI/n1JuWEzCggQXl54DQ4ZwQ==";
  const BASE_URL = "https://apis.data.go.kr/1160100/service/GetStockSecuritiesInfoService/getStockPriceInfo";
  const today = dayjs().format("YYYYMMDD");
  const beginDate = dayjs().subtract(14, "day").format("YYYYMMDD");

  useEffect(() => {
    const fetchStockData = async () => {
        const cacheKey = `InG:stock:${itemName}:${today}`;
        const cached = localStorage.getItem(cacheKey);

    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        setStockData(parsed.data);
        return;
      } catch (e) {
        console.warn("⚠️ Failed to parse cached data:", e);
      }
    }

      try {
        const res = await axios.get(BASE_URL, {
          params: {
            serviceKey: API_KEY,
            resultType: "json",
            itmsNm: itemName,  // 종목명 (e.g., "삼성전자")
            numOfRows: 100,
            pageNo: 1,
            beginBasDt: beginDate,
            endBasDt: today,
          },
        });
        console.log("📦 Full API response:", res.data);

        const items = res.data?.response?.body?.items?.item || [];
        items.sort((a,b) => b.basDt.localeCompare(a.basDt));
        const recent7 = items.slice(0, 7).reverse();

        if (recent7.length > 0) {
            setStockData(recent7);
            localStorage.setItem(cacheKey, JSON.stringify({date: today, data: recent7}))
        } else if (items.length === 0) {
          // No data found for today, look for the most recent cached data in localStorage
          let latestDate = null;
          let latestData = null;
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            const prefix = `InG:stock:${itemName}:`;
            if (key && key.startsWith(prefix)) {
              try {
                const cachedEntry = JSON.parse(localStorage.getItem(key));
                if (cachedEntry && cachedEntry.date && cachedEntry.data) {
                  if (!latestDate || cachedEntry.date > latestDate) {
                    latestDate = cachedEntry.date;
                    latestData = cachedEntry.data;
                  }
                }
              } catch (e) {
                console.warn("⚠️ Failed to parse cached entry:", e);
              }
            }
          }
          if (latestData) {
            setStockData(latestData);
          } else {
            setError("No data found.");
          }
        } else {
          setError("No data found.");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch stock data.");
      }
    };

    fetchStockData();
  }, [itemName]);

  return (
    <div className="h-full border border-ing-border bg-ing-bg-light text-ing-text rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold text-ing-primary m-4">📈 {itemName} 주식 정보</h2>
      {error && <p className="text-red-500">{error}</p>}
      {stockData && stockData.length >= 7 ? (
        <>
        {/* <ul className="text-sm leading-relaxed">
           <li><strong>종가:</strong> {stockData[stockData.length-1].clpr}원</li>
           <li><strong>시가:</strong> {stockData[stockData.length-1].mkp}원</li>
           <li><strong>고가:</strong> {stockData[stockData.length-1].hipr}원</li>
           <li><strong>저가:</strong> {stockData[stockData.length-1].lopr}원</li>
           <li><strong>등락률:</strong> {stockData[stockData.length-1].fltRt}%</li>
           <li><strong>거래량:</strong> {stockData[stockData.length-1].trqu.toLocaleString()}주</li>
           <li><strong>시가총액:</strong> {Number(stockData[stockData.length-1].mrktTotAmt).toLocaleString()}원</li>
        </ul> */}
        <CandleChart data={stockData} />
        </>

      ) : (
        !error && <p>로딩 중...</p>
      )}
    </div>
  );
};

export default KoreaStockKRX;