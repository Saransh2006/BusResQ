
import { getReports, saveReport } from "./db";

const API_URL = "http://localhost:5000/api/incidents";

let isSyncing = false;

function notifyReportsUpdated() {
  window.dispatchEvent(new Event("busresq-reports-updated"));
}

export async function syncPendingReports() {
  if (!navigator.onLine || isSyncing) {
    return;
  }

  isSyncing = true;

  try {
    const reports = await getReports();

  const pendingReports = reports.filter(
  (report) =>
    ["pending", "offline"].includes(report.syncStatus) ||
    (!report.syncStatus &&
      !["Received", "Resolved"].includes(report.status))
);
    for (const report of pendingReports) {
      if (!navigator.onLine) break;

      try {
        const response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...report,
            clientReportId: report.id,
          }),
        });

        if (!response.ok) {
          console.warn(
            `Report ${report.id} remains pending. HTTP ${response.status}`
          );
          continue;
        }

        await saveReport({
          ...report,
          syncStatus: "synced",
          status: "Received",
          syncedAt: new Date().toISOString(),
        });

        notifyReportsUpdated();

        console.log(`Report ${report.id} synced successfully.`);
      } catch (error) {
        console.warn(
          `Report ${report.id} remains queued:`,
          error.message
        );
      }
    }
  } catch (error) {
    console.error("Unable to read pending reports:", error);
  } finally {
    isSyncing = false;
  }
}
