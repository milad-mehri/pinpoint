"use client";

import Link from "next/link";
import { X } from "lucide-react";

export default function FeedbackBanner({ onDismiss }) {
  return (
    <div className="w-full bg-blue-50 text-blue-800 py-2 text-center text-sm absolute top-0 left-0 z-10">
      <span>Pinpoint needs your help to improve. </span>
      <Link
        href="/feedback"
        className="font-medium text-blue-600 underline hover:text-blue-800"
      >
        Submit feedback here!
      </Link>
      <button
        onClick={onDismiss}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-600 hover:text-blue-800"
        aria-label="Dismiss feedback banner"
      >
        <X size={16} />
      </button>
    </div>
  );
}
