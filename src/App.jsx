import React from 'react'
import ReactDOM from 'react-dom/client'
import { useState, useEffect} from 'react'
import {Routes, Route, Link, useNavigate, Outlet} from 'react-router-dom'
import axios from "axios";

import MobileView from "./InfoComponents/MobileView.jsx";
import DesktopView from "./InfoComponents/DesktopView.jsx";

import Story from './Story/Story.jsx'
import StoryCard from './Story/functions/StoryCard.jsx'
import BottomNav from "./screenComponents/BottomNav.jsx"
import Home from "./Routes/Home.jsx"
import Settings from "./Routes/Settings.jsx"

import KoreaStockYahoo from './Story/contents/KoreaStockYahoo.jsx';

import './App.css'
import WeatherSlide from './Story/contents/weatherContents.jsx';
import QuoteSlide from './Story/contents/quoteContents.jsx';

const isMoblie = window.innerWidth < 768



function App() {
  const [isStandalone, setIsStandalone] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showStory, setShowStory] = useState(false);
  const [navBarState, setNavBarState] = useState("home");
  // const navigate = useNavigate();

  useEffect(() => {
    const checkStandalone = () => {
      const isInStandaloneMode =
        window.matchMedia('(display-mode: standalone)').matches ||
        window.navigator.standalone === true;

      setIsStandalone(isInStandaloneMode);
    };

    checkStandalone();

    // Optional: update when display mode changes (some browsers support this)
    window.matchMedia('(display-mode: standalone)').addEventListener('change', checkStandalone);

    // Update mobile state on resize
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  if (!isStandalone && isMobile) {
    return (
      <div className="App">
        <MobileView/>
      </div>
    )
  } else if (!isStandalone && !isMobile) {
    return (
      <div className="App">
        <DesktopView/>
      </div>
    )
  } else {

  return (
    <div className="App">
      {!showStory && (
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      )}

      {showStory && (
        <Story onClose={() => setShowStory(false)} />
      )}

      {!showStory && <BottomNav onExploreClick={() => setShowStory(true)} />}
    </div>
  )
}

}

export default App;
