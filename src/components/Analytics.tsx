// src/components/Analytics.tsx
import Script from "next/script";

const PLAUSIBLE_DOMAIN = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
const PLAUSIBLE_SCRIPT_URL =
  process.env.NEXT_PUBLIC_PLAUSIBLE_SCRIPT_URL ||
  "https://plausible.io/js/script.js";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? 'G-L1ZZDZHCKQ';
const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID ?? 'y7y89ogod6';
const AHREFS_ID = process.env.NEXT_PUBLIC_AHREFS_ANALYTICS_ID ?? 'agKYRGi9UmZ6yAMFTS9FpQ';

function PlausibleScript() {
  if (!PLAUSIBLE_DOMAIN) return null;

  return (
    <Script
      defer
      data-domain={PLAUSIBLE_DOMAIN}
      src={PLAUSIBLE_SCRIPT_URL}
      strategy="afterInteractive"
    />
  );
}

function GA4Script() {
  if (!GA_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}
      </Script>
    </>
  );
}

function ClarityScript() {
  if (!CLARITY_ID) return null;

  return (
    <Script id="clarity" strategy="afterInteractive">
      {`
        (function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);
          t.async=1;
          t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];
          y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "${CLARITY_ID}");
      `}
    </Script>
  );
}

function AhrefsScript() {
  if (!AHREFS_ID) return null;

  return (
    <Script
      src="https://analytics.ahrefs.com/analytics.js"
      data-key={AHREFS_ID}
      strategy="afterInteractive"
    />
  );
}

export function AnalyticsScripts() {
  return (
    <>
      <PlausibleScript />
      <GA4Script />
      <ClarityScript />
      <AhrefsScript />
    </>
  );
}
