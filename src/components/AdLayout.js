"use client";

import Script from "next/script";
import { useEffect, useRef } from "react";

const AdLayout = ({ children }) => {
  const adsInitialized = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined' || adsInitialized.current) return;

    const initAds = () => {
      try {
        if (!window.adsbygoogle) {
          window.adsbygoogle = [];
        }
        adsInitialized.current = true;
      } catch (err) {
        console.error('Error initializing adsbygoogle:', err);
      }
    };

    initAds();
  }, []);

  // Check if we're on the production domain
  const shouldShowAds = typeof window !== 'undefined' && window.location.hostname === 'playpinpoint.co';

  return (
    <>
      {shouldShowAds && (
        <Script
          id="adsbygoogle-script"
          strategy="lazyOnload"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8194314786011681"
          crossOrigin="anonymous"
          onReady={() => {
            try {
              const ads = document.getElementsByClassName("adsbygoogle");
              Array.from(ads).forEach((ad) => {
                if (!ad.hasAttribute('data-adsbygoogle-initialized')) {
                  (window.adsbygoogle = window.adsbygoogle || []).push({});
                  ad.setAttribute('data-adsbygoogle-initialized', 'true');
                }
              });
            } catch (err) {
              console.error('Error in AdSense initialization:', err);
            }
          }}
          onError={(e) => {
            console.error('Error loading AdSense script:', e);
          }}
        />
      )}

      {/* Desktop and Tablet Ads */}
      {shouldShowAds && (
        <div className="hidden xl:block">
          {/* Left Ad */}
          <div className="fixed left-4 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
            <div className="pointer-events-auto">
              <ins className="adsbygoogle"
                   style={{ display: 'inline-block', width: '120px', height: '600px' }}
                   data-ad-client="ca-pub-8194314786011681"
                   data-ad-slot="1907975431"
                   data-ad-format="vertical"
                   data-full-width-responsive="false" />
            </div>
          </div>

          {/* Right Ad */}
          <div className="fixed right-4 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
            <div className="pointer-events-auto">
              <ins className="adsbygoogle"
                   style={{ display: 'inline-block', width: '120px', height: '600px' }}
                   data-ad-client="ca-pub-8194314786011681"
                   data-ad-slot="2762726259"
                   data-ad-format="vertical"
                   data-full-width-responsive="false" />
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      {children}

      {/* Mobile Bottom Ad */}
      {shouldShowAds && (
        <div className="xl:hidden mt-4 w-full flex justify-center">
          <ins className="adsbygoogle"
               style={{ display: 'inline-block', width: '320px', height: '100px' }}
               data-ad-client="ca-pub-8194314786011681"
               data-ad-slot="1449644587"
               data-ad-format="horizontal"
               data-full-width-responsive="false" />
        </div>
      )}
    </>
  );
};

export default AdLayout; 