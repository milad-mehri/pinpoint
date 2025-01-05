"use client";

import { useState, useEffect } from "react";

const DailyTimer = () => {
  const [timeRemaining, setTimeRemaining] = useState("");

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const pstDate = new Date(now.toLocaleString("en-US", { timeZone: "America/Los_Angeles" }));
      const nextMidnight = new Date(
        pstDate.getFullYear(),
        pstDate.getMonth(),
        pstDate.getDate() + 1,
        0, // 12 AM PST
        0,
        0
      );

      const diff = nextMidnight - pstDate;
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
    };

    updateCountdown(); // Initialize immediately
    const timer = setInterval(updateCountdown, 1000);

    return () => clearInterval(timer); // Cleanup on unmount
  }, []);

  return (
    <div className="text-center text-gray-700 mt-4">
      Next Daily in: <span className="font-semibold">{timeRemaining}</span>
    </div>
  );
};

export default DailyTimer;
