"use client";

import Link from "next/link";
import { X } from "lucide-react";

export default function FeedbackBanner({ onDismiss }) {
  return (
    <div className="w-full bg-blue-50 text-blue-800 py-2 text-center text-sm relative">
      <div className="max-w-4xl mx-auto px-8 flex items-center justify-center">
        <div>
          <span>Pinpoint needs your help to improve. </span>
          <Link
            href="/feedback"
            className="font-medium text-blue-600 underline hover:text-blue-800"
          >
            Submit feedback here!
          </Link>
        </div>
        <button
          onClick={onDismiss}
          className="ml-4 text-blue-600 hover:text-blue-800"
          aria-label="Dismiss feedback banner"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
