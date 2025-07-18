import React, { useState } from "react";
import { DateTime } from "luxon";
import { moodIcons } from "../../constants/moodicons.js";

const faces = {
  1: "😢",
  2: "😐",
  3: "🙂",
  4: "😄",
  5: "🤩",
};

const weekdays = ["S", "M", "T", "W", "T", "F", "S"];

export default function MoodCalendarSlide() {
  const [offset, setOffset] = useState(0);
  const now = DateTime.now().plus({ months: offset });
  const startOfMonth = now.startOf("month");
  const daysInMonth = now.daysInMonth;
  const firstWeekday = startOfMonth.weekday % 7; // Sunday as 0

  const moodKey = `mood-${now.toFormat("yyyy-MM")}`;
  const storedMoods = JSON.parse(localStorage.getItem(moodKey) || "{}");

  const moodData = Array.from({ length: daysInMonth }, (_, i) => {
    const day = String(i + 1);
    const moodValue = storedMoods[day];
    return moodValue !== undefined ? String(moodValue) : day; // strict check
  });

  const calendarCells = [
    ...Array(firstWeekday).fill(""),
    ...moodData,
  ];

return (
    <div className="bg-ing-bg-dark text-ing-text p-6 rounded-xl text-center">
        <div className="flex justify-between items-center mb-4">
            <button onClick={() => setOffset(offset - 1)}>◀</button>
            <h2 className="text-xl font-semibold">{now.toFormat("yyyy MM")}</h2>
            <button onClick={() => setOffset(offset + 1)}>▶</button>
        </div>
        <div className="grid grid-cols-7 gap-2 text-sm mb-2 font-semibold text-ing-text-muted">
            {weekdays.map((day, index) => (
                <div key={`${day}-${index}`} className="text-center">
                    {day}
                </div>
            ))}
        </div>
        <div className="grid grid-cols-7 gap-2 text-lg">
            {calendarCells.map((content, i) => (
                <div
                    key={i}
                    className="aspect-square flex items-center justify-center border border-ing-border rounded"
                >
                    {moodIcons.hasOwnProperty(content) ? (
                        <img
                            src={moodIcons[content]}
                            alt={`mood-${content}`}
                            className="w-8 h-8"
                        />
                    ) : (
                        <span className="text-ing-text-muted">{content}</span>
                    )}
                </div>
            ))}
        </div>
    </div>
);
}