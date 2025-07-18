import React, { useState, useEffect, useRef } from "react";
import "./functions/StoryCard.jsx"
import "./../App.css";
import { useSelector, useDispatch } from 'react-redux';
import axios from "axios";

import StoryCard from "../Story/functions/StoryCard.jsx"

import QuoteSlide from "./contents/quoteContents.jsx"
import NewsSlide from "./contents/newsContents.jsx";
import BasicSlide from "./contents/basicContents.jsx";
import MoodCalendarSlide from "./contents/moodCalenderContents.jsx";
// import stockContents from "./contents/stockContents.jsx";

import KoreaStockKRX from "./contents/KoreaStockKRX.jsx";
import WeatherSlide from "./contents/weatherContents.jsx";




const STORY_DURATION = 10000; // 4초마다 자동 전환

const basicContents = [
  { component: <BasicSlide type={1} /> },
  { component: <BasicSlide type={2} /> },
];

const newsContents = [
  { component: <NewsSlide type={1}/> },
  { component: <NewsSlide type={2}/> },
];

const weatherContents = [
  { component: <WeatherSlide /> },
];

const quoteContents = [
  { component: <QuoteSlide type="random"/> },
  { component: <QuoteSlide type="life"/> },
  { component: <QuoteSlide type="daily"/> },
];

const moodCalenderContents = [
  { component: <MoodCalendarSlide /> },
];



export default function Story({ onClose }) {
  const [currentStory, setCurrentStory] = useState(0);
  const timerRef = useRef(null);
  const stocks = useSelector((state) => state.stocks.list);

  const stockContents = stocks.map((stock, i) => ({
    component: <KoreaStockKRX key={i} itemName={stock.name} />
  }));

  const allStories = [
    basicContents,
    quoteContents,
    weatherContents,
    ...(stockContents.length > 0 ? [stockContents] : []),
    newsContents,
    moodCalenderContents,
  ];

  function handleNextStory() {
    if (currentStory < allStories.length - 1) {
      setCurrentStory(c => c + 1);
    } else {
      onClose();
    }
  }

  function handleBeforeStory() {
    if (currentStory > 0) {
      setCurrentStory(c => c - 1);
    }
  }

  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden" }}>
      <div
        style={{
          width: `${allStories.length * 100}vw`,
          height: "100vh",
          display: "flex",
          transform: `translateX(-${currentStory * 100}vw)`,
          transition: "transform 0.5s ease",
          touchAction: "pan-y"
        }}
        onTouchStart={e => {
          timerRef.currentStory = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY
          };
        }}
        onTouchEnd={e => {
          if (!timerRef.currentStory) return;
          const dx = e.changedTouches[0].clientX - timerRef.currentStory.x;
          if (dx < -50 && currentStory < allStories.length - 1) {
            setCurrentStory(c => c + 1);
          } else if (dx > 50 && currentStory > 0) {
            setCurrentStory(c => c - 1);
          }
          timerRef.currentStory = null;
        }}
      >
        {allStories.map((story, idx) => (
          <StoryCard
            key={idx}
            contents={story}
            nextStory={handleNextStory}
            currentStory={currentStory}
            idx={idx}
            onClose={onClose}
            handleBeforeStory={handleBeforeStory}
          />
        ))}
      </div>
    </div>
  );
}
