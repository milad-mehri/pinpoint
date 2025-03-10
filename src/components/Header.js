"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import InstructionsModal from "./InstructionsModal"; // Modal component

const Header = () => {
  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isDailyPage = pathname === "/" || pathname.startsWith("/daily");
  const isPracticePage = pathname.startsWith("/practice");

  return (
    <>
      <header className="w-full bg-white py-4 shadow-md">
        <div className="max-w-4xl mx-auto flex justify-between items-center px-4">
          {/* Left Side - Title */}
          <div className="text-xl font-bold flex items-center">
            <span>Pinpoint</span>
            <span className="ml-2 text-slate-600">
              {isDailyPage ? "Daily" : "Practice"}
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

      {/* Modal */}
      {isModalOpen && <InstructionsModal onClose={() => setIsModalOpen(false)} />}
    </>
  );
};

export default Header;
