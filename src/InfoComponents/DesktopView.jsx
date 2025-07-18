import React from "react";

export default function DesktopView() {
  return (
    <div className="min-h-screen w-full bg-ing-bg text-ing-text flex flex-col">
      <header className="bg-ing-bg-dark text-ing-text px-8 py-4 shadow-md">
        <h1 className="text-3xl font-bold">In:G</h1>
      </header>

      <main className="flex-1 px-12 py-12 w-full">
        <h2 className="text-4xl font-bold mb-6">Live in Growth 🌱</h2>
        <p className="text-xl mb-6">
          In:G is a personal growth platform that helps you start your day with mindfulness, clarity, and motivation.
        </p>
        <p className="text-lg text-ing-text-muted mb-10">
          Install the In:G PWA to unlock the full immersive experience including quotes, news, weather, and more.
        </p>
        <div className="text-sm text-ing-text-muted bg-ing-bg-light border border-ing-border-muted rounded p-4">
          <p className="font-semibold mb-2">How to install:</p>
          <ul className="list-disc list-inside">
            <li>Click the install icon in your browser’s address bar</li>
            <li>Or choose “Add to Home Screen” on mobile</li>
          </ul>
        </div>
      </main>

      <footer className="bg-ing-bg-dark text-ing-text-muted text-sm px-8 py-4 text-center">
        &copy; {new Date().getFullYear()} In:G. All rights reserved.
      </footer>
    </div>
  );
}
