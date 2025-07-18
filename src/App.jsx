import React from 'react'
import ReactDOM from 'react-dom/client'
import { useState, useEffect} from 'react'
import {Routes, Route, Link, useNavigate, Outlet} from 'react-router-dom'
import axios from "axios";

import Story from './Story/Story.jsx'
import StoryCard from './Story/functions/StoryCard.jsx'
import BottomNav from "./screenComponents/BottomNav.jsx"
import Home from "./Routes/Home.jsx"
import Settings from "./Routes/Settings.jsx"

import KoreaStockYahoo from './Story/contents/KoreaStockYahoo.jsx';

import './App.css'
import WeatherSlide from './Story/contents/weatherContents.jsx';
import QuoteSlide from './Story/contents/quoteContents.jsx';



function App() {
  const [showStory, setShowStory] = useState(false);
  const [navBarState, setNavBarState] = useState("home");
  // const navigate = useNavigate();

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

export default App;
