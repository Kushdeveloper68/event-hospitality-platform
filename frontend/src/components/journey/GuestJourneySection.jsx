import { Suspense, lazy, useEffect, useRef, useState } from "react";

// The figure is ~230 KB of path data, so it loads only when the section is about to scroll into view.
const GuestJourney = lazy(() => import("./GuestJourney.jsx"));

export default function GuestJourneySection() {
  const hostRef = useRef(null);
  const [near, setNear] = useState(() => typeof IntersectionObserver === "undefined");

  useEffect(() => {
    const host = hostRef.current;
    if (!host || near) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true);
          observer.disconnect();
        }
      },
      { rootMargin: "600px 0px" },
    );
    observer.observe(host);
    return () => observer.disconnect();
  }, [near]);

  return (
    <div ref={hostRef} style={{ minHeight: near ? undefined : 560 }}>
      {near && (
        <Suspense fallback={<div style={{ minHeight: 560 }} aria-busy="true" />}>
          <GuestJourney />
        </Suspense>
      )}
    </div>
  );
}
