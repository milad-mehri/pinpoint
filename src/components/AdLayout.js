"use client";

import Script from "next/script";
import { useEffect } from "react";

const AdLayout = ({ children }) => {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error('Error initializing ads:', err);
    }
  }, []);

  return (
    <>
      {/* Desktop Ads */}
      <div className="hidden lg:block">
        {/* Left Ad */}
        <div className="fixed left-4 top-1/2 -translate-y-1/2 w-[300px] h-[600px]">
          <ins className="adsbygoogle"
               style={{ display: 'block' }}
               data-ad-client="ca-pub-8194314786011681"
               data-ad-slot="1907975431"
               data-ad-format="auto"
               data-full-width-responsive="true" />
        </div>

        {/* Right Ad */}
        <div className="fixed right-4 top-1/2 -translate-y-1/2 w-[300px] h-[600px]">
          <ins className="adsbygoogle"
               style={{ display: 'block' }}
               data-ad-client="ca-pub-8194314786011681"
               data-ad-slot="2762726259"
               data-ad-format="auto"
               data-full-width-responsive="true" />
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full">
        {children}

        {/* Mobile Bottom Ad */}
        <div className="lg:hidden mt-4 w-full min-h-[100px] flex justify-center">
          <ins className="adsbygoogle"
               style={{ display: 'block' }}
               data-ad-client="ca-pub-8194314786011681"
               data-ad-slot="1449644587"
               data-ad-format="auto"
               data-full-width-responsive="true" />
        </div>
      </div>

      {/* AdSense Script */}
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8194314786011681"
        crossOrigin="anonymous"
        strategy="afterInteractive"
        onError={(e) => {
          console.error('Error loading AdSense script:', e);
        }}
      />
    </>
  );
};

export default AdLayout; 