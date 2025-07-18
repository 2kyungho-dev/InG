import { useState } from "react";
import { DateTime } from "luxon";
import { moodIcons } from "../constants/moodicons.js";

const faces = [
  { emoji: "😢", value: 1 },
  { emoji: "😐", value: 2 },
  { emoji: "🙂", value: 3 },
  { emoji: "😄", value: 4 },
  { emoji: "🤩", value: 5 },
];

export default function RateYourDay() {
  const [selected, setSelected] = useState(
    Number(localStorage.getItem(DateTime.now().toISODate())) || 0
  );

  const handleRate = (value) => {
  setSelected(value);
  const now = DateTime.now();
  const key = `mood-${now.toFormat("yyyy-MM")}`;
  const day = now.toFormat("dd");

  const existing = JSON.parse(localStorage.getItem(key) || "{}");
  existing[day] = value;
  localStorage.setItem(key, JSON.stringify(existing));
};

return (
    <div className="bg-ing-bg p-4 rounded-xl shadow-md text-ing-text text-center space-y-2">
        <h2 className="text-lg font-semibold">오늘 하루 어땠나요?</h2>
        <div className="flex justify-center gap-4 text-3xl">
            {Object.entries(moodIcons).map(([key, icon]) => (
                <button
                    key={key}
                    onClick={() => handleRate(Number(key))}
                    className={`w-10 h-10 p-1 rounded-full transition-transform duration-100 ${
                        selected === Number(key) ? "scale-125" : "opacity-50"
                    }`}
                >
                    <img src={icon} alt={`mood-${key}`} />
                </button>
            ))}
        </div>
    </div>
);
}