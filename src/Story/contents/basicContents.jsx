import React from "react";

export default function BasicSlide({ type }) {
  let content = "";

  const now = new Date();
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const formattedTime = `${hours}:${minutes}`;

  switch (type) {
    case 1:
      content = "좋은 아침 입니다";
      break;
    case 2:
      const month = now.getMonth() + 1;
      const date = now.getDate();
      const weekdays = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
      const dayOfWeek = weekdays[now.getDay()];
      content = [
        <div key="line1">오늘은 {month}월 {date}일 {dayOfWeek}입니다.</div>,
        <div key="line2">현재 시각은 {formattedTime}.</div>,
        <div key="line3">하루를 시작할 준비가 되셨나요?</div>,
      ];
      break;
    default:
      content = "좋은 하루 되세요!";
  }

  return (
    <div className="bg-ing-bg-dark text-ing-text p-6 pt-70 rounded text-2xl font-semibold w-full h-full flex flex-col items-center justify-start text-center gap-4">
      {content}
    </div>
  );
}