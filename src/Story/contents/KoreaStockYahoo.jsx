// StockYahoo.js
import React, { useEffect, useState } from "react";
import axios from "axios";

const KoreaStockYahoo = ({ symbol, companyName }) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const options = {
    method: "GET",
    url: `https://yahoo-finance15.p.rapidapi.com/api/yahoo/qu/quote/${symbol}`,
    headers: {
      "X-RapidAPI-Key": "752e5d0a0dmshe83e7dc6f2ecfbcp15d2e8jsnee61ff3b268e", // Replace with your key
      'X-RapidAPI-Host': 'yahoo-finance15.p.rapidapi.com',
    },
  };

  useEffect(() => {
    axios
      .request(options)
      .then((response) => {
        setData(response.data);
      })
      .catch((err) => {
        setError("Failed to fetch stock data.");
      });
  }, [symbol]);

  return (
    <div className="p-4 border rounded-xl shadow-xl max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-2">{companyName} ({symbol})</h2>
      {error && <p className="text-red-500">{error}</p>}
      {data ? (
        <div>
          <p><strong>Price:</strong> ₩{data.regularMarketPrice}</p>
          <p><strong>Change:</strong> {data.regularMarketChange} ({data.regularMarketChangePercent}%)</p>
          <p><strong>Open:</strong> ₩{data.regularMarketOpen}</p>
          <p><strong>Previous Close:</strong> ₩{data.regularMarketPreviousClose}</p>
          <p><strong>Market Cap:</strong> {data.marketCap?.toLocaleString()}</p>
        </div>
      ) : !error ? (
        <p>Loading...</p>
      ) : null}
    </div>
  );
};

export default KoreaStockYahoo;
