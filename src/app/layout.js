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
  title: "Pinpoint - Daily Category Guessing Game & Unlimited Practice Mode",
  description:
    "Play Pinpoint - the ultimate category guessing game! Daily puzzles and unlimited practice mode. Challenge your knowledge with our fun, free online game. Perfect for trivia lovers!",
  openGraph: {
    title: "Pinpoint - Daily Category Guessing Game & Unlimited Practice Mode",
    description:
      "Play Pinpoint - the ultimate category guessing game! Daily puzzles and unlimited practice mode. Challenge your knowledge with our fun, free online game.",
    url: "https://playpinpoint.co",
    images: [
      {
        url: "https://playpinpoint.co/example2.gif",
        width: 1200,
        height: 630,
        alt: "Pinpoint Game - Category Guessing Challenge",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pinpoint - Daily Category Guessing Game & Unlimited Practice Mode",
    description:
      "Play Pinpoint - the ultimate category guessing game with daily puzzles and unlimited practice mode!",
    images: ["https://playpinpoint.co/example2.gif"],
  },
  icons: {
    icon: "https://playpinpoint.co/favicon.ico",
  },
  keywords: [
    "pinpoint game",
    "pinpoint game unlimited",
    "pinpoint unlimited",
    "pinpoint unlimited game",
    "pinpoint category game",
    "pinpoint game online",
    "game pinpoint",
    "pin point game",
    "pin point games",
    "pin-point game",
    "category guessing game",
    "daily puzzle game",
    "online trivia game",
    "word guessing game",
    "knowledge challenge"
  ],
  alternates: {
    canonical: "https://playpinpoint.co"
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Domain Redirection Script */}
        <Script id="domain-redirect" strategy="beforeInteractive">
          {`
            (function() {
              if (typeof window !== 'undefined' && window.location.hostname !== 'playpinpoint.co' && window.location.hostname !== 'localhost') {
                const newUrl = 'https://playpinpoint.co' + window.location.pathname + window.location.search + window.location.hash;
                window.location.replace(newUrl);
              }
            })();
          `}
        </Script>

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
              cookie_domain: 'playpinpoint.co',
              cookie_flags: 'SameSite=None;Secure'
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
