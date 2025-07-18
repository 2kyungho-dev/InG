import React from "react";

export default function MobileView() {
  return (
    <div className="min-h-screen bg-ing-bg text-ing-text flex flex-col items-center justify-center px-4 py-10 text-center">
      <h1 className="text-3xl font-bold mb-4">Welcome to In:G 🌱</h1>
      <p className="text-base mb-5">
        In:G (Live in Growth) is your daily companion for mindfulness, motivation, and meaningful starts. 
      </p>
      <p className="text-base text-ing-text-muted mb-8">
        For the full experience, please install the In:G app to your home screen.
      </p>
      <div className="text-sm text-ing-text-muted">
        <p className="font-semibold mb-1">To install:</p>
        <ul className="list-disc list-inside">
          <li>Tap the share icon in your browser</li>
          <li>Then choose "Add to Home Screen"</li>
        </ul>
      </div>
    </div>
  );
}