import React, { useState, useEffect, useRef } from "react";

import "./../../App.css";


const STORY_DURATION = 200000; // 4초마다 자동 전환

export default function StoryCard({ nextStory, contents, currentStory, idx, onClose, handleBeforeStory }) {
    const [current, setCurrent] = useState(0);
    const timerRef = useRef(null);
    const pauseRef = useRef(false);
    const touchStartTime = useRef(0);

    useEffect(() => {
        if (currentStory !== idx || pauseRef.current) return;

        timerRef.current = setTimeout(() => {
            if (current < contents.length - 1) {
                setCurrent(current + 1);
            } else {
                nextStory();
            }
        }, STORY_DURATION);

        return () => clearTimeout(timerRef.current);
    }, [current, currentStory, contents.length, idx, nextStory]);

    const handleTouchStart = (e) => {
        clearTimeout(timerRef.current);
        pauseRef.current = true;
        touchStartTime.current = Date.now();
    };

    const handleTouchEnd = (e) => {
        const touchX = e.changedTouches[0].clientX;
        const screenWidth = window.innerWidth;
        const duration = Date.now() - touchStartTime.current;
        pauseRef.current = false;

        if (duration < 100) {
            if (touchX < screenWidth * 0.3) {
                if (current === 0) {
                    handleBeforeStory();
                } else {
                    handlePrev();
                }
            } else {
                handleNext();
            }
        }
    };

    const handleNext = () => {
        clearTimeout(timerRef.current);
        if (current < contents.length - 1) {
            setCurrent(current + 1);
        } else {
            nextStory();
        }
    };

    const handlePrev = () => {
        clearTimeout(timerRef.current);
        if (current > 0) {
            setCurrent(current - 1);
        }
    };

    return (
        <div className="story-modal">
            <div className="story-frame">
                <div className="story-progress">
                    {contents.map((_, idx) => (
                        <div
                            key={idx}
                            className={`progress-bar ${idx <= current ? "active" : ""}`}
                        />
                    ))}
                </div>
                <button className="story-close" onClick={onClose}>
                    ×
                </button>
                <div
                    className="story-content-container relative w-full h-full"
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                >
                    {contents.map((c, idx) => (
                        <div
                            key={idx}
                            className={`absolute inset-0 transition-opacity duration-10 ${
                                idx === current ? "opacity-100" : "opacity-0 pointer-events-none"
                            }`}
                        >
                            {c.component}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}