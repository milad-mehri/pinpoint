import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import DOMSafetyProvider from "../components/DOMSafetyProvider";
import DOMErrorBoundary from "../components/DOMErrorBoundary";

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
    url: "https://pinpointpuzzle.netlify.app",
    images: [
      {
        url: "https://pinpointpuzzle.netlify.app/example2.gif",
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
    images: ["https://pinpointpuzzle.netlify.app/example2.gif"],
  },
  icons: {
    icon: "https://pinpointpuzzle.netlify.app/favicon.ico",
  },
  keywords: [
    "category guessing game",
    "Pinpoint",
    "linkedin games",
    "trivia game",
    "knowledge challenge",
    "intuitive guessing",
    "pinpoint LinkedIn",
    "category clues",
    "word guessing game",
    "engaging games",
    "guess the category",
    "online trivia game"
  ],
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Fix for iOS viewport */}
        <meta 
          name="viewport" 
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" 
        />
        
        {/* iOS specific meta tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        
        {/* DOM Safety Patches - applied as early as possible */}
        <Script id="dom-safety-patches" strategy="beforeInteractive">
          {`
          (function() {
            // Apply patches to prevent 'removeChild' errors
            if (typeof Node !== 'undefined') {
              // Store original methods
              const originalRemoveChild = Node.prototype.removeChild;
              
              // Make removeChild safe
              Node.prototype.removeChild = function(child) {
                if (!child) return null;
                
                // Only proceed if the child is actually a child of this node
                if (this.contains && this.contains(child)) {
                  try {
                    return originalRemoveChild.call(this, child);
                  } catch (e) {
                    console.warn('[DOM Safety] removeChild error:', e.message);
                    return child;
                  }
                } else {
                  // Not a child, just return it
                  return child;
                }
              };
              
              console.log('[DOM Safety] DOM patches applied during initial load');
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
        cookie_domain: 'pinpointpuzzle.netlify.app', // Your GitHub Pages domain
        cookie_flags: 'SameSite=None;Secure'   // Ensures cookie compatibility for HTTPS
      });
    `}
        </Script>
        
        {/* iOS keyboard fix script */}
        <Script id="ios-keyboard-fix">
          {`
          (function() {
            var viewportHeight = window.innerHeight;
            
            function setViewportProperties() {
              document.documentElement.style.setProperty('--vh', window.innerHeight * 0.01 + 'px');
            }
            
            // Detect iOS
            const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                         (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
            
            if (isIOS) {
              window.addEventListener('resize', function() {
                // If the keyboard is open, the window.innerHeight will be smaller
                if (window.innerHeight < viewportHeight) {
                  document.documentElement.style.setProperty('--keyboard-height', (viewportHeight - window.innerHeight) + 'px');
                } else {
                  document.documentElement.style.setProperty('--keyboard-height', '0px');
                  viewportHeight = window.innerHeight; // Update the max height
                }
                setViewportProperties();
              });
              
              // Ensure scrolling is enabled
              document.addEventListener('touchmove', function(e) {
                const target = e.target;
                const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA';
                
                if (!isInput) {
                  e.preventDefault();
                }
              }, { passive: false });
            }
            
            // Initial call
            setViewportProperties();
          })();
          `}
        </Script>
      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <DOMErrorBoundary>
          <DOMSafetyProvider>
            {children}
          </DOMSafetyProvider>
        </DOMErrorBoundary>
      </body>
    </html>
  );
}
