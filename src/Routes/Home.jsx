import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import RateYourDay from "../screenComponents/RateYourDay.jsx";

function Home() {
  const dailyGoals = useSelector((state) => state.goals.dailyGoals);
  const today = new Date().toISOString().split("T")[0];
  const todayGoalEntry = dailyGoals.find((goal) => goal.date === today);

  const [timeData, setTimeData] = useState(() => getFormattedDateTime());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeData(getFormattedDateTime());
    }, 60000); // update every minute
    return () => clearInterval(interval);
  }, []);

  function getFormattedDateTime() {
    const now = new Date();
    const pad = (n) => n.toString().padStart(2, "0");
    const time = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
    const date = `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()}`;
    const day = now.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase();
    return { time, date: `${date} ${day}` };
  }

  const getYearProgress = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const end = new Date(now.getFullYear() + 1, 0, 1);
    return (((now - start) / (end - start)) * 100).toFixed(1);
  };

  const getMonthProgress = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const start = new Date(year, month, 1);
    const end = new Date(year, month + 1, 1);
    return (((now - start) / (end - start)) * 100).toFixed(1);
  };

  const yearProgress = getYearProgress();

  return (
    <div className="w-full min-h-screen flex flex-col bg-ing-bg-light p-4">
      <main className="flex-1 overflow-y-auto pb-[env(safe-area-inset-bottom)]">
        <div className="bg-ing-bg shadow-md rounded-lg p-4 mb-4 text-center">
          <h2 className="text-4xl font-bold text-ing-text mb-1">{timeData.time}</h2>
          <p className="text-ing-text-muted text-lg mb-1">{timeData.date}</p>
        </div>
      
        <div className="bg-ing-bg shadow-md rounded-lg p-4 mb-4">
          <h2 className="text-xl font-semibold text-ing-text-muted mb-2">Daily Goal</h2>
          <p className="text-ing-text">
            {todayGoalEntry ? todayGoalEntry.quote : "No goal set for today."}
          </p>
        </div>

        <div className="bg-ing-bg shadow-md rounded-lg p-4 mb-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-2xl font-semibold text-ing-text-muted">{new Date().getFullYear()}</h2>
            <p className="text-ing-text text-xl">{yearProgress}%</p>
          </div>
          <div className="w-full h-2 bg-ing-border-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-ing-primary transition-all duration-300"
              style={{ width: `${yearProgress}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-ing-bg shadow-md rounded-lg p-4 mb-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-2xl font-semibold text-ing-text-muted">
              {new Date().toLocaleDateString("en-US", { month: "long" }).toUpperCase()}
            </h2>
            <p className="text-ing-text text-xl">
              {getMonthProgress()}%
            </p>
          </div>
          <div className="w-full h-2 bg-ing-border-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-ing-primary transition-all duration-300"
              style={{ width: `${getMonthProgress()}%` }}
            ></div>
          </div>
        </div>

        <div className="mb-4">
          <RateYourDay />
        </div>
        
        <div className="bg-ing-bg shadow-md rounded-lg p-4 mb-4">
          <h2 className="text-xl font-semibold text-ing-text-muted mb-2">Daily Goal</h2>
          <p className="text-ing-text">
            {todayGoalEntry ? todayGoalEntry.quote : "No goal set for today."}
          </p>
        </div>

      </main>
    </div>
  );
}

export default Home;