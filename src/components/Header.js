"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import InstructionsModal from "./InstructionsModal";
import FeedbackBanner from "./FeedbackBanner";

const Header = () => {
  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showBanner, setShowBanner] = useState(null);
  const [mounted, setMounted] = useState(false);

  const isDailyPage = pathname === "/" || pathname.startsWith("/daily");
  const isPracticePage = pathname.startsWith("/practice");
  const isFeedbackPage = pathname.startsWith("/feedback");

  useEffect(() => {
    // Initialize state after mount
    setMounted(true);

    // Wrap localStorage operations in try-catch for safety
    try {
      // Check if it's the user's first visit
      const hasVisited = window.localStorage.getItem('hasVisitedBefore');
      if (!hasVisited) {
        setIsModalOpen(true);
        window.localStorage.setItem('hasVisitedBefore', 'true');
      }

      // Check feedback banner dismissal time
      const lastDismissed = window.localStorage.getItem('feedbackDismissedAt');
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      setShowBanner(!lastDismissed || new Date(lastDismissed) < oneWeekAgo);
    } catch (error) {
      // Fallback if localStorage is not available
      console.error('localStorage error:', error);
      setShowBanner(true);
    }
  }, []);

  const handleFeedbackDismiss = () => {
    try {
      setShowBanner(false);
      window.localStorage.setItem('feedbackDismissedAt', new Date().toISOString());
    } catch (error) {
      console.error('Error saving dismissal time:', error);
    }
  };

  // Don't render banner until we've checked localStorage
  if (!mounted || showBanner === null) {
    return (
      <header className="w-full bg-white shadow-md">
        <div className="max-w-4xl mx-auto flex justify-between items-center px-4 py-4 w-full">
          {/* Left Side - Title */}
          <div className="text-xl font-bold flex items-center">
            <Link href="/" className="hover:opacity-80 transition-opacity">
              <span className="gradient-text text-2xl">Pinpoint</span>
            </Link>{" "}
            <span className="ml-2 text-slate-600">
              {isDailyPage ? "Daily" : isFeedbackPage ? "Feedback" : "Practice"}
              {isPracticePage && (
                <span className="ml-2 bg-yellow-500 text-black px-2 py-1 rounded text-sm">
                  EXP
                </span>
              )}
            </span>
          </div>

          {/* Right Side - Navigation */}
          <div className="flex space-x-4 items-center">
            {isDailyPage ? (
              <Link
                href="/practice"
                className="text-lg font-semibold flex items-center hover:underline"
              >
                Practice{" "}
                <span className="ml-2 bg-yellow-500 text-black px-2 py-1 rounded text-sm">
                  EXP
                </span>
              </Link>
            ) : (
              <Link
                href="/"
                className="text-lg font-semibold flex items-center hover:underline"
              >
                Daily
              </Link>
            )}

            {/* Question Mark Icon */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-gray-500 hover:text-gray-700 transition"
            >
              <FontAwesomeIcon icon={faQuestionCircle} className="text-2xl" />
            </button>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="w-full bg-white shadow-md">
      {showBanner && (
        <div className="w-full border-b border-blue-100">
          <FeedbackBanner onDismiss={handleFeedbackDismiss} />
        </div>
      )}
      <div className="max-w-4xl mx-auto flex justify-between items-center px-4 py-4 w-full">
        {/* Left Side - Title */}
        <div className="text-xl font-bold flex items-center">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <span className="gradient-text text-2xl">Pinpoint</span>
          </Link>{" "}
          <span className="ml-2 text-slate-600">
            {isDailyPage ? "Daily" : isFeedbackPage ? "Feedback" : "Practice"}
            {isPracticePage && (
              <span className="ml-2 bg-yellow-500 text-black px-2 py-1 rounded text-sm">
                EXP
              </span>
            )}
          </span>
        </div>

        {/* Right Side - Navigation */}
        <div className="flex space-x-4 items-center">
          {isDailyPage ? (
            <Link
              href="/practice"
              className="text-lg font-semibold flex items-center hover:underline"
            >
              Practice{" "}
              <span className="ml-2 bg-yellow-500 text-black px-2 py-1 rounded text-sm">
                EXP
              </span>
            </Link>
          ) : (
            <Link
              href="/"
              className="text-lg font-semibold flex items-center hover:underline"
            >
              Daily
            </Link>
          )}

          {/* Question Mark Icon */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <FontAwesomeIcon icon={faQuestionCircle} className="text-2xl" />
          </button>
        </div>
      </div>
      {isModalOpen && <InstructionsModal onClose={() => setIsModalOpen(false)} />}
    </header>
  );
};

export default Header;
