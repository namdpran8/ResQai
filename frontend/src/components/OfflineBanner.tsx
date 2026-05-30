import React, { useEffect, useState } from "react";

export default function OfflineBanner() {
  const [online, setOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);

  useEffect(() => {
    const onOnline = () => setOnline(true);
    const onOffline = () => setOnline(false);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  if (online) return null;

  return (
    <div role="status" aria-live="polite" className="absolute left-0 right-0 top-0 z-50">
      <div className="mx-auto w-full max-w-[430px] px-4 py-2 bg-amber-500/95 text-white text-sm font-semibold text-center">
        Offline — using cached data and SMS fallbacks
      </div>
    </div>
  );
}
