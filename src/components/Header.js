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

  const headerContent = (
    <div className="max-w-4xl mx-auto flex justify-between items-center px-3 sm:px-6 py-3 sm:py-5 w-full">
      {/* Left Side - Title */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        <Link href="/" className="hover:opacity-90 transition-opacity">
          <span className="gradient-text text-xl sm:text-2xl font-extrabold tracking-tight">Pinpoint</span>
        </Link>
        <div className="flex items-center">
          <span className="h-4 w-px bg-gray-300 mx-2 sm:mx-3" />
          <span className="text-sm sm:text-base font-medium text-gray-600">
            {isDailyPage ? "Daily" : isFeedbackPage ? "Feedback" : "Practice"}
            {isPracticePage && (
              <span className="ml-1.5 sm:ml-2 bg-yellow-500 text-black px-1.5 sm:px-2.5 py-0.5 rounded-full text-xs sm:text-sm font-semibold inline-flex items-center">
                EXP
              </span>
            )}
          </span>
        </div>
      </div>

      {/* Right Side - Navigation */}
      <div className="flex items-center space-x-3 sm:space-x-6">
        {isDailyPage ? (
          <Link
            href="/practice"
            className="text-sm sm:text-base font-medium text-gray-700 hover:text-gray-900 transition-colors flex items-center group"
          >
            Practice
            <span className="ml-1.5 sm:ml-2 bg-yellow-500 text-black px-1.5 sm:px-2.5 py-0.5 rounded-full text-xs sm:text-sm font-semibold group-hover:bg-yellow-600 transition-colors">
              EXP
            </span>
          </Link>
        ) : (
          <Link
            href="/"
            className="text-sm sm:text-base font-medium text-gray-700 hover:text-gray-900 transition-colors"
          >
            Daily
          </Link>
        )}

        {/* Question Mark Icon */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="text-gray-500 hover:text-gray-700 transition-colors p-1.5 sm:p-2 rounded-full hover:bg-gray-100"
        >
          <FontAwesomeIcon icon={faQuestionCircle} className="text-lg sm:text-xl" />
        </button>
      </div>
    </div>
  );

  // Don't render banner until we've checked localStorage
  if (!mounted || showBanner === null) {
    return (
      <header className="w-full bg-white shadow-sm border-b border-gray-200">
        {headerContent}
      </header>
    );
  }

  return (
    <header className="w-full bg-white shadow-sm border-b border-gray-200">
      {showBanner && (
        <div className="w-full border-b border-blue-100">
          <FeedbackBanner onDismiss={handleFeedbackDismiss} />
        </div>
      )}
      {headerContent}
      {isModalOpen && <InstructionsModal onClose={() => setIsModalOpen(false)} />}
    </header>
  );
};

export default Header;
