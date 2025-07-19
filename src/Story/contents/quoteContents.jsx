import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { addDailyGoal } from "../../store/goalSlice";

const quotes = [
    {
        quote: "The best way to get started is to quit talking and begin doing.",
        author: "Walt Disney",
        translation: "시작하는 가장 좋은 방법은 말하는 것을 멈추고 행동하는 것이다.",
    },
    {
        quote: "Don’t let yesterday take up too much of today.",
        author: "Will Rogers",
        translation: "어제에 너무 얽매이지 말고 오늘을 살아라.",
    },
    {
        quote: "It’s not whether you get knocked down, it’s whether you get up.",
        author: "Vince Lombardi",
        translation: "넘어지는 것이 중요한 게 아니라, 다시 일어나는 것이 중요하다.",
    },
    {
        quote: "If you are working on something exciting, it will keep you motivated.",
        author: "Steve Jobs",
        translation: "흥미로운 무언가를 하고 있다면, 그것이 당신을 계속 동기부여하게 만든다.",
    },
    {
        quote: "Success is not in what you have, but who you are.",
        author: "Bo Bennett",
        translation: "성공은 당신이 무엇을 가졌느냐가 아니라, 어떤 사람이냐에 달려 있다.",
    },
    {
        quote: "The harder you work for something, the greater you’ll feel when you achieve it.",
        author: "Unknown",
        translation: "무언가를 위해 더 열심히 일할수록, 그것을 성취했을 때 더 큰 기쁨을 느낀다.",
    },
    {
        quote: "Dream bigger. Do bigger.",
        author: "Unknown",
        translation: "더 크게 꿈꾸고, 더 크게 행동하라.",
    },
    {
        quote: "Don’t watch the clock; do what it does. Keep going.",
        author: "Sam Levenson",
        translation: "시계를 보지 말고 시계처럼 움직여라. 계속 나아가라.",
    },
    {
        quote: "Great things never come from comfort zones.",
        author: "Unknown",
        translation: "위대한 일은 절대 안락한 곳에서 나오지 않는다.",
    },
    {
        quote: "Push yourself, because no one else is going to do it for you.",
        author: "Unknown",
        translation: "스스로를 밀어붙여라. 아무도 대신해주지 않는다.",
    },
    {
        quote: "Success doesn’t just find you. You have to go out and get it.",
        author: "Unknown",
        translation: "성공은 저절로 오지 않는다. 스스로 찾아 나서야 한다.",
    },
    {
        quote: "The only limit to our realization of tomorrow is our doubts of today.",
        author: "Franklin D. Roosevelt",
        translation: "내일의 실현을 가로막는 유일한 한계는 오늘의 의심이다.",
    },
    {
        quote: "Sometimes later becomes never. Do it now.",
        author: "Unknown",
        translation: "때로는 '나중에'가 '절대'가 된다. 지금 해라.",
    },
    {
        quote: "Little things make big days.",
        author: "Isabel Marant",
        translation: "작은 일이 큰 하루를 만든다.",
    },
    {
        quote: "Don’t stop when you’re tired. Stop when you’re done.",
        author: "Marilyn Monroe",
        translation: "지쳤을 때 멈추지 말고, 끝났을 때 멈춰라.",
    },
    {
        quote: "Wake up with determination. Go to bed with satisfaction.",
        author: "Unknown",
        translation: "결심과 함께 일어나고, 만족과 함께 잠들어라.",
    },
    {
        quote: "Do something today that your future self will thank you for.",
        author: "Sean Patrick Flanery",
        translation: "미래의 당신이 고마워할 무언가를 오늘 하라.",
    },
    {
        quote: "It always seems impossible until it’s done.",
        author: "Nelson Mandela",
        translation: "모든 것은 끝나기 전까지는 불가능해 보인다.",
    },
    {
        quote: "You don’t have to be great to start, but you have to start to be great.",
        author: "Zig Ziglar",
        translation: "위대하게 시작할 필요는 없지만, 시작해야 위대해질 수 있다.",
    },
    {
        quote: "The secret of getting ahead is getting started.",
        author: "Mark Twain",
        translation: "앞서 나가는 비결은 시작하는 것이다.",
    },
    {
        quote: "Start where you are. Use what you have. Do what you can.",
        author: "Arthur Ashe",
        translation: "지금 있는 곳에서 시작하라. 있는 것을 사용하라. 할 수 있는 것을 하라.",
    },
    {
        quote: "I never dreamed about success. I worked for it.",
        author: "Estée Lauder",
        translation: "나는 성공을 꿈꾸지 않았다. 그것을 위해 노력했다.",
    },
    {
        quote: "Believe you can and you're halfway there.",
        author: "Theodore Roosevelt",
        translation: "할 수 있다고 믿어라. 그러면 반은 이미 도달한 것이다.",
    },
    {
        quote: "Act as if what you do makes a difference. It does.",
        author: "William James",
        translation: "당신의 행동이 차이를 만든다고 생각하라. 실제로 그렇다.",
    },
    {
        quote: "What you get by achieving your goals is not as important as what you become by achieving your goals.",
        author: "Zig Ziglar",
        translation: "목표를 이루어 얻는 것보다 더 중요한 것은, 그 목표를 이루며 어떤 사람이 되느냐이다.",
    }
];

function getTodayQuote() {
    const today = new Date();
    const startDate = new Date("2025-01-01"); // Set a fixed reference date
    const diffDays = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
    const index = diffDays % quotes.length;
    return quotes[index];
}

export default function QuoteSlide({ type = "random" }) {
    const lifeGoals = useSelector((state) => state.goals.lifeGoals);
    const dailyGoals = useSelector((state) => state.goals.dailyGoals);
    const today = new Date().toISOString().split('T')[0];
    const todayGoalEntry = dailyGoals.find(goal => goal.date === today);
    const [inputGoal, setInputGoal] = useState(todayGoalEntry ? todayGoalEntry.quote : "");
    const dispatch = useDispatch();

    if (type === "life") {
        return (
            <div className="w-full h-screen bg-ing-bg-dark text-ing-text flex justify-center pt-20 px-4">
                <div className="w-full max-w-md text-left">
                    <h2 className="text-4xl font-extrabold text-ing-primary mb-30 text-center">
                        My Life Goals
                    </h2>
                    {lifeGoals && lifeGoals.length > 0 ? (
                        <div className="space-y-10">
                            {lifeGoals.map((goal, index) => (
                                <div key={index} className="flex items-start">
                                    <span className="text-ing-text font-bold mr-3 text-2xl">
                                        {index + 1}.
                                    </span>
                                    <span className="text-ing-primary font-bold text-2xl leading-snug">
                                        {goal}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-ing-text-muted text-xl text-center">No life goals set.</p>
                    )}
                </div>
            </div>
        );
    }

    if (type === "daily") {
      const handleSave = () => {
        dispatch(addDailyGoal(inputGoal));
        setInputGoal("");
      };

      return (
        <div className="w-full min-h-screen flex items-start justify-center pt-20 bg-ing-bg-dark text-ing-text">
          <div
            className="bg-ing-bg-dark text-ing-text rounded-lg w-full max-w-md flex flex-col items-center justify-center text-center h-full"
          >
            <h2 className="text-4xl font-extrabold text-ing-primary mb-30">Today's Goal</h2>
            {todayGoalEntry && (
              <p className="text-xl font-bold text-ing-text mb-10">{todayGoalEntry.quote}</p>
            )}
            <input
              type="text"
              className="px-2 py-1 rounded text-ing-text w-full max-w-xs mb-4 bg-ing-bg placeholder-gray-400"
              placeholder="Enter your goal for today"
              value={inputGoal}
              onChange={(e) => setInputGoal(e.target.value)}
              onTouchStart={(e) => e.stopPropagation()}
              onTouchEnd={(e) => e.stopPropagation()}
            />
            <button
              onClick={handleSave}
              onTouchStart={(e) => e.stopPropagation()}
              onTouchEnd={(e) => e.stopPropagation()}
              className="bg-ing-primary text-ing-bg-light px-3 py-1 rounded hover:bg-ing-primary/90"
            >
              {todayGoalEntry ? "Update Goal" : "Save Goal"}
            </button>
          </div>
        </div>
      );
    }

    // type === "random" or any other
    const { quote, author, translation } = getTodayQuote();

    return (
        <div className="w-full min-h-screen flex items-start justify-center pt-50 bg-ing-bg-dark text-ing-text">
            <div className="bg-ing-bg-dark text-ing-text px-4 py-8 rounded-lg w-full max-w-md flex flex-col items-center justify-center text-center h-full">
                <p className="text-3xl sm:text-4xl font-semibold text-ing-primary mb-6">“{quote}”</p>
                <p className="text-md italic text-ing-border-muted mb-3">— {author}</p>
                <p className="text-sm text-ing-text-muted mt-6">{translation}</p>
            </div>
        </div>
    );
}
