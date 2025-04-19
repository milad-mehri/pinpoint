"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import changelog from "../data/changelog.json";

const InstructionsModal = ({ onClose }) => {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState("howToPlay");

  const handleLinkClick = (path) => {
    if (pathname === path) {
      onClose();
    }
  };

  const handleClickOutside = (e) => {
    if (e.target.id === "modal-overlay") onClose();
  };

  // Get most recent change
  const latestChange = changelog.changes[0];

  return (
    <AnimatePresence>
      <motion.div
        id="modal-overlay"
        onClick={handleClickOutside}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white rounded-lg shadow-lg max-w-lg w-full mx-4 p-6 relative"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", duration: 0.5 }}
        >
          {/* Close Button */}
          <motion.button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <FontAwesomeIcon icon={faTimes} className="text-lg" />
          </motion.button>

          {/* Tabs */}
          <div className="flex space-x-4 mb-6 border-b border-gray-200">
            {["howToPlay", "updates"].map((tab) => (
              <motion.button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-2 px-1 font-medium transition-colors relative ${
                  activeTab === tab
                    ? "text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {tab === "howToPlay" ? "How to Play" : "Updates"}
                {activeTab === tab && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                    layoutId="activeTab"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === "howToPlay" ? (
                <>
                  {/* How to Play Content */}
                  <motion.h2 
                    className="text-xl font-semibold mb-4 text-black text-left"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    How to Play
                  </motion.h2>
                  <motion.p 
                    className="text-gray-800 text-sm text-left mb-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    There are 5 clues hidden on the board. All 5 clues belong to a common
                    category. Your objective is to guess the category with the fewest
                    clues revealed. Each incorrect guess will reveal the next clue.
                  </motion.p>

                  {/* Examples */}
                  <motion.div 
                    className="mb-6"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
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
                  </motion.div>

                  {/* Gameplay GIF */}
                  <motion.div 
                    className="w-full h-58 bg-gray-200 rounded-md mb-4 flex items-center justify-center overflow-hidden"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <img
                      src="/example2.gif"
                      alt="Gameplay demonstration"
                      className="w-full h-full rounded-md object-cover scale-120"
                      style={{
                        transform: "scale(1.3)",
                        transition: "transform 0.3s ease",
                      }}
                    />
                  </motion.div>
                </>
              ) : (
                /* Updates Content */
                <div className="space-y-6">
                  <motion.div 
                    className="flex items-baseline justify-between mb-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <h2 className="text-xl font-semibold text-black">Latest Updates</h2>
                    <span className="text-sm text-gray-500">
                      {new Date(latestChange.date).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </motion.div>
                  
                  <motion.ul 
                    className="list-disc list-inside text-sm text-gray-700 space-y-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    {latestChange.updates.map((update, index) => {
                      const linkMatch = update.match(/\[(.*?)\]\((.*?)\)/);
                      if (linkMatch) {
                        const [fullMatch, text, url] = linkMatch;
                        const parts = update.split(fullMatch);
                        return (
                          <motion.li 
                            key={index} 
                            className="text-gray-600"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 * (index + 1) }}
                          >
                            {parts[0]}
                            <Link href={url} className="text-blue-600 hover:underline">
                              {text}
                            </Link>
                            {parts[1]}
                          </motion.li>
                        );
                      }
                      return (
                        <motion.li 
                          key={index} 
                          className="text-gray-600"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * (index + 1) }}
                        >
                          {update}
                        </motion.li>
                      );
                    })}
                  </motion.ul>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    {/* <Link
                      href="/changelog"
                      onClick={onClose}
                      className="inline-block mt-4 text-blue-600 hover:text-blue-800 font-medium"
                    >
                      View Full Changelog →
                    </Link> */}
                  </motion.div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Footer Links */}
          <motion.div 
            className="mt-6 pt-4 border-t border-gray-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Link
              href="https://milad-mehri.github.io/"
              className="text-sm text-blue-800 font-extrabold hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Contact
            </Link>
            <span>, </span>
            <Link
              href="/feedback"
              onClick={() => handleLinkClick('/feedback')}
              className="text-sm text-blue-800 font-extrabold hover:underline"
            >
              Feedback
            </Link>
            <span>, </span>
            <Link
              href="https://github.com/milad-mehri/pinpoint/"
              className="text-sm text-blue-800 font-extrabold hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Github
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default InstructionsModal;
