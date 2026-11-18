
import { useEffect } from "react";
import { syncPendingReports } from "../services/syncService";

export default function useAutoSync() {
  useEffect(() => {
    function handleOnline() {
      syncPendingReports();
    }

    window.addEventListener("online", handleOnline);

    // Attempt a sync when the app starts.
    syncPendingReports();

    return () => {
      window.removeEventListener("online", handleOnline);
    };
  }, []);
}
