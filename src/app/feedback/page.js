"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import Header from "../../components/Header"
import { ChevronRight } from "lucide-react"

export const metadata = {
  title: "Feedback - Pinpoint Category Guessing Game",
  description: "Share your feedback and suggestions for Pinpoint - the category guessing game. Help us improve your gaming experience!",
  openGraph: {
    title: "Feedback - Pinpoint Category Guessing Game",
    description: "Share your feedback and suggestions for Pinpoint - the category guessing game. Help us improve your gaming experience!",
    url: "https://playpinpoint.co/feedback",
  },
  alternates: {
    canonical: "https://playpinpoint.co/feedback"
  }
};

export default function FeedbackPage() {
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    message: "",
    contribute: false,
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Create the form data to submit
    const formDataToSubmit = new FormData(e.target)

    try {
      // Submit the form data to Netlify
      const response = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formDataToSubmit).toString(),
      })

      if (response.ok) {
        // Show the thank you message
        setSubmitted(true)
        // Reset the form
        setFormData({ name: "", contact: "", message: "", contribute: false })
      } else {
        console.error("Form submission failed")
      }
    } catch (error) {
      console.error("Form submission error:", error)
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      {/* Header Navigation */}
      <header className="flex-shrink-0">
        <Header />
      </header>

      {/* Feedback Section */}
      <main className="flex-grow flex items-start justify-center px-6 py-8">
        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="thank-you"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.6 }}
              className="text-left max-w-xl w-full mt-8"
            >
              <h1 className="text-green-600 text-5xl font-bold mb-2">Thank you for your feedback!</h1>
              <p className="text-sm text-gray-500 mb-10">Some small text here cuz it looks cool</p>

              <h2 className="text-2xl font-bold mb-6">Continue to...</h2>
              <ul className="space-y-5">
                <li>
                  <Link
                    href="/"
                    className="flex items-center text-xl font-medium text-black hover:text-green-600 transition-colors"
                  >
                    Daily <ChevronRight className="ml-2 w-5 h-5" />
                  </Link>
                </li>
                <li>
                  <Link
                    href="/practice"
                    className="flex items-center text-xl font-medium text-black hover:text-green-600 transition-colors"
                  >
                    Practice <ChevronRight className="ml-2 w-5 h-5" />
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://github.com/milad-mehri/pinpoint"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-xl font-medium text-black hover:text-green-600 transition-colors"
                  >
                    GitHub <ChevronRight className="ml-2 w-5 h-5" />
                  </Link>
                </li>
              </ul>
            </motion.div>
          ) : (
            <motion.form
              name="feedback"
              method="POST"
              data-netlify="true"
              netlify-honeypot="bot-field"
              action="/feedback"
              onSubmit={handleSubmit}
              className="p-10 max-w-2xl w-full space-y-6 text-left"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Netlify form requirements */}
              <input type="hidden" name="form-name" value="feedback" />
              <input type="hidden" name="no-cache" value="1" />
              <p className="hidden">
                <label>
                  Don't fill this out if you're human: <input name="bot-field" />
                </label>
              </p>

              <motion.h1
                className="text-3xl font-bold text-gray-800"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Share Feedback or Contribute
              </motion.h1>

              <motion.p
                className="text-gray-500 text-sm"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Got an idea, bug report, or want to help build Pinpoint?
              </motion.p>

              <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name (optional)</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-md border border-gray-200 focus:border-gray-300 focus:outline-none bg-transparent"
                  placeholder="Your name"
                />
              </motion.div>

              <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact (ex. email, phone, Discord, etc.)
                </label>
                <input
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-md border border-gray-200 focus:border-gray-300 focus:outline-none bg-transparent"
                  placeholder="you@example.com"
                />
              </motion.div>

              <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-2 rounded-md border border-gray-200 focus:border-gray-300 focus:outline-none bg-transparent"
                  placeholder="Tell me what's on your mind..."
                ></textarea>
              </motion.div>

              <motion.button
                type="submit"
                className="text-blue-500 hover:text-blue-700 font-semibold py-2 px-0 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                Submit
              </motion.button>
            </motion.form>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
