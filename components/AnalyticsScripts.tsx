import Script from "next/script";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";

type AnalyticsScriptsProps = { measurementId?: string; clarityProjectId?: string };

export function AnalyticsScripts({ measurementId, clarityProjectId }: AnalyticsScriptsProps) {
  return (
    <>
      {measurementId ? <GoogleAnalytics measurementId={measurementId} /> : null}
      {clarityProjectId ? (
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${clarityProjectId}");`}
        </Script>
      ) : null}
    </>
  );
}
