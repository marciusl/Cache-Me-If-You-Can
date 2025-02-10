import React, { useEffect, useState } from "react";

export function ServiceWorkerBase() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(
    null
  );

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then((registration) => {
          registration.onupdatefound = () => {
            const installingWorker = registration.installing;
            if (installingWorker) {
              installingWorker.onstatechange = () => {
                if (
                  installingWorker.state === "installed" &&
                  navigator.serviceWorker.controller
                ) {
                  setUpdateAvailable(true);
                  setWaitingWorker(registration.waiting);
                }
              };
            }
          };
        });

      navigator.serviceWorker.addEventListener("controllerchange", () => {
        console.log("New service worker is controlling the page.");
        setUpdateAvailable(true);
      });
    }
  }, []);

  const handleRefresh = () => {
    waitingWorker!.postMessage("skipWaiting");
    window.location.reload();
  };

  return (
    <div>
      {updateAvailable && (
        <div className="update-banner">
          <p>A new version is available. Please refresh the page.</p>
          <button onClick={handleRefresh}>Refresh</button>
        </div>
      )}
    </div>
  );
}
