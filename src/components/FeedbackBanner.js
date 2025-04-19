"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function FeedbackBanner({ onDismiss }) {
  return (
    <AnimatePresence>
      <motion.div
        className="w-full bg-blue-50 text-blue-800 py-2 text-center text-sm relative"
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="max-w-4xl mx-auto px-8 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <span>Improved puzzles coming soon! </span>
            <Link
              href="/feedback"
              className="font-medium text-blue-600 underline hover:text-blue-800"
            >
              Submit feedback here!
            </Link>
          </motion.div>
          <motion.button
            onClick={onDismiss}
            className="ml-4 text-blue-600 hover:text-blue-800"
            aria-label="Dismiss feedback banner"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X size={16} />
          </motion.button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
