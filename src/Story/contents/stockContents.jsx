import { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import { store } from '../../store';


import KoreaStockYahoo from "./KoreaStockYahoo.jsx";
import KoreaStockKRX from "./KoreaStockKRX.jsx";

const stockContents = () => {
    const stocks = useSelector((state) => state.stocks.list) 
    console.log(stocks)

  return stocks.map((stock, i) => ({
    component: <KoreaStockKRX key={i} itemName={stock} />
  }));
};

export default stockContents;


//////////////////////////////////////////
// NOT BEING USED. NEEDS TO BE REMOVED //
//////////////////////////////////////////