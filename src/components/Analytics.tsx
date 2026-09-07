// src/components/Analytics.tsx

const PLAUSIBLE_DOMAIN = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN ?? 'kdpnichefinder.net';
const PLAUSIBLE_SCRIPT_URL =
  process.env.NEXT_PUBLIC_PLAUSIBLE_SCRIPT_URL ??
  'https://plausible.shipsolo.io/js/script.js';

const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? 'G-L1ZZDZHCKQ';
const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID ?? 'y7y89ogod6';
const AHREFS_ID = process.env.NEXT_PUBLIC_AHREFS_ANALYTICS_ID ?? 'agKYRGi9UmZ6yAMFTS9FpQ';

export function AnalyticsScripts() {
  return (
    <>
      {PLAUSIBLE_DOMAIN && (
        <script
          defer
          data-domain={PLAUSIBLE_DOMAIN}
          src={PLAUSIBLE_SCRIPT_URL}
        />
      )}

      {GA_ID && (
        <>
          <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} />
          <script>
            {`window.dataLayer = window.dataLayer || [];
function gtag(){window.dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}');`}
          </script>
        </>
      )}

      {CLARITY_ID && (
        <script>
          {`(function(c,l,a,r,i,t,y){
  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window, document, "clarity", "script", "${CLARITY_ID}");`}
        </script>
      )}

      {AHREFS_ID && (
        <script
          async
          src="https://analytics.ahrefs.com/analytics.js"
          data-key={AHREFS_ID}
        />
      )}
    </>
  );
}
