import React, { useEffect, useState } from "react";
import axios from "axios";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase.js"; // adjust the path if needed
import he from "he";

const NewsSlide = ({ type = 1 }) => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    async function fetchNaverNews() {
      const today = new Date().toLocaleDateString('en-CA');
      const docRef = doc(db, "news", today);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setArticles(data.articles || []);
      } else {
        console.log("No Naver news found for today.");
      }
    }

    async function fetchFinanceNews() {
      const today = new Date().toLocaleDateString('en-CA');
      const docRef = doc(db, "news", today);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setArticles(data.finance || []);
      } else {
        console.log("No finance news found for today.");
      }
    }

    async function fetchN8nNews() {
      const today = new Date().toLocaleDateString('en-CA');
      const docRef = doc(db, "n8nnews", today);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setArticles(data.articles || []);
      } else {
        console.log("No Naver news found for today. News updated in 06:00");
      }
    }

    if (type === 1) {
      fetchNaverNews();
    } else if (type === 2) {
      fetchN8nNews();
    }
  }, [type]);

  const sectionTitles = {
    1: "속보",
    2: "경제",
    // future types can be added here
  };

  return (
    <div className="w-full h-full overflow-y-auto p-4 bg-ing-bg text-ing-text">
      <h2 className="text-center text-2xl font-bold text-ing-primary mb-6">
        {sectionTitles[type] || "뉴스"}
      </h2>
      {articles.map((article, idx) => (
        <div
          key={idx}
          className="mb-6 pb-4 border-b border-ing-border-muted"
        >
          <h3 className="text-lg text-ing-text">
            {he
              .decode(article.title)
              .replace(/<[^>]*>/g, "") // Remove HTML tags
              .trim()}
          </h3>
          <a
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm underline text-ing-primary"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            onTouchEnd={(e) => e.stopPropagation()}
          >
            📰 원문 보기
          </a>
          <div className="text-xs mt-1 text-ing-text-muted">
            {new Date(article.pubDate).toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );
};

export default NewsSlide;