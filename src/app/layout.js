import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Pinpoint - The Ultimate Category Guessing Game",
  description:
    "Challenge your knowledge and intuition in Pinpoint! Guess the correct category based on given clues. Fun, engaging, and perfect for trivia lovers!",
  openGraph: {
    title: "Pinpoint - The Ultimate Category Guessing Game",
    description:
      "Test your knowledge and intuition in Pinpoint! Can you guess the correct category from the clues? Join the fun now!",
    url: "https://milad-mehri.github.io/pinpoint/",
    images: [
      {
        url: "https://milad-mehri.github.io/pinpoint/example2.gif",
        width: 1200,
        height: 630,
        alt: "Pinpoint - The Ultimate Category Guessing Game",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pinpoint - The Ultimate Category Guessing Game",
    description:
      "Dive into the fun of Pinpoint! Guess the categories, test your wits, and share the challenge with friends.",
    images: ["https://milad-mehri.github.io/pinpoint/example2.gif"],
  },
  icons: {
    icon: "https://milad-mehri.github.io/pinpoint/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics Script */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-LXN713BY75"
        />
        <Script id="google-analytics">
          {`
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-LXN713BY75', {
        cookie_domain: 'milad-mehri.github.io', // Your GitHub Pages domain
        cookie_flags: 'SameSite=None;Secure'   // Ensures cookie compatibility for HTTPS
      });
    `}
        </Script>
      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
