"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import InstructionsModal from "./InstructionsModal";
import FeedbackBanner from "./FeedbackBanner";

const Header = () => {
  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showBanner, setShowBanner] = useState(true);

  const isDailyPage = pathname === "/" || pathname.startsWith("/daily");
  const isPracticePage = pathname.startsWith("/practice");
  const isFeedbackPage = pathname.startsWith("/feedback");

  return (
    <div className="relative">
      {showBanner && (
        <div className="w-full bg-white border-b border-gray-200 z-20 relative">
          <FeedbackBanner onDismiss={() => setShowBanner(false)} />
        </div>
      )}
      <header className="w-full bg-white py-4 shadow-md sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex justify-between items-center px-4">
          {/* Left Side - Title */}
          <div className="text-xl font-bold flex items-center">
            <Link href="/" className="hover:opacity-80 transition-opacity">
              <span className="bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">Pinpoint</span>
            </Link>{" "}
            <span className="ml-2 text-slate-600">
              {isDailyPage ? "Daily" : isFeedbackPage ? "Feedback" : "Practice"}
              {isPracticePage && (
                <span className="ml-2 bg-yellow-500 text-black px-2 py-1 rounded-md text-sm font-medium shadow-sm">
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
                className="text-lg font-semibold flex items-center hover:text-blue-600 transition-colors"
              >
                Practice{" "}
                <span className="ml-2 bg-yellow-500 text-black px-2 py-1 rounded-md text-sm font-medium shadow-sm hover:bg-yellow-400 transition-colors">
                  EXP
                </span>
              </Link>
            ) : (
              <Link
                href="/"
                className="text-lg font-semibold flex items-center hover:text-blue-600 transition-colors"
              >
                Daily
              </Link>
            )}

            {/* Question Mark Icon */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-gray-500 hover:text-blue-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
              aria-label="Instructions"
            >
              <FontAwesomeIcon icon={faQuestionCircle} className="text-2xl" />
            </button>
          </div>
        </div>
      </header>
      {isModalOpen && (
        <InstructionsModal onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
};

export default Header;
