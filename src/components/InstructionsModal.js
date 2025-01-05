"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

const InstructionsModal = ({ onClose }) => {
  const handleClickOutside = (e) => {
    if (e.target.id === "modal-overlay") onClose();
  };

  return (
    <div
      id="modal-overlay"
      onClick={handleClickOutside}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full mx-4 p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <FontAwesomeIcon icon={faTimes} className="text-lg" />
        </button>

        {/* Modal Content */}
        <h2 className="text-xl font-semibold mb-4 text-black text-left">
          How to Play
        </h2>
        <p className="text-gray-800 text-sm text-left mb-4">
          There are 5 clues hidden on the board. All 5 clues belong to a common
          category. Your objective is to guess the category with the fewest
          clues revealed. Each incorrect guess will reveal the next clue.
        </p>

        {/* Examples */}
        <div className="mb-6">
          <h3 className="text-lg text-gray-900 mb-2 text-left">Examples:</h3>
          <ul className="list-disc text-sm list-inside text-gray-700 space-y-2">
            <li>
              Lunch, Sand, Mail, Safe deposit, Think outside the →{" "}
              <strong>Words that come before "box"</strong>
            </li>
            <li>
              Violin, Guitar, Kite, Tennis racquet, Marionette →{" "}
              <strong>Things with strings</strong>
            </li>
            <li>
              Fry, Coddle, Poach, Scramble, Hard-boil →{" "}
              <strong>Ways to prepare eggs</strong>
            </li>
          </ul>
        </div>

        {/* Placeholder for Gameplay GIF */}
        <div className="w-full h-58 bg-gray-200 rounded-md mb-4 flex items-center justify-center overflow-hidden">
          <img
            src="/example2.gif"
            alt="Gameplay demonstration"
            className="w-full h-full  rounded-md object-cover scale-120"
            style={{
              transform: "scale(1.3)",
              transition: "transform 0.3s ease",
            }}
          />
        </div>

        {/* Navigation Buttons
        <div className="flex justify-center gap-4">
          <Link
            href="/"
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-200 text-black px-4 py-2 rounded shadow transition text-center"
          >
            Daily Mode
          </Link>
          <Link
            href="/practice"
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-200 text-black px-4 py-2 rounded shadow transition text-center"
          >
            Practice Mode
          </Link>
        </div> */}
      </div>
    </div>
  );
};

export default InstructionsModal;
