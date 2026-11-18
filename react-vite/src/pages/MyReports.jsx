
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowLeft, BusFront, FileText } from "lucide-react";
import { getReports } from "../services/db";
import StatusBadge from "../components/StatusBadge";

export default function MyReports() {
  const location = useLocation();

  const [reports, setReports] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadReports() {
      try {
        setLoadError("");

        // Load only reports saved on this device.
        // Do not merge in frontend demo reports.
        const saved = await getReports();

        if (!cancelled) {
          setReports(
            [...saved].sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
          );
        }
      } catch (error) {
        console.error("Unable to load reports:", error);

        if (!cancelled) {
          setLoadError(
            "Unable to load your saved reports. Please refresh the page."
          );
        }
      }
    }

    function handleReportsUpdated() {
      loadReports();
    }

    loadReports();

    window.addEventListener(
      "busresq-reports-updated",
      handleReportsUpdated
    );

    window.addEventListener("online", handleReportsUpdated);

    return () => {
      cancelled = true;

      window.removeEventListener(
        "busresq-reports-updated",
        handleReportsUpdated
      );

      window.removeEventListener("online", handleReportsUpdated);
    };
  }, [location.key]);

  const filteredReports =
    filter === "All"
      ? reports
      : reports.filter((report) => {
          if (filter === "Queued") {
            return (
              report.syncStatus !== "synced" &&
              report.status !== "Received" &&
              report.status !== "Resolved"
            );
          }

          return report.status === filter;
        });

  return (
    <div className="page-stack">
      <Link to="/" className="back-link">
        <ArrowLeft size={18} /> Back to home
      </Link>

      <section className="page-intro">
        <span className="eyebrow">YOUR ACTIVITY</span>
        <h1>My reports</h1>
        <p>View reports saved on this device and their delivery status.</p>
      </section>

      {location.state?.justCreated && (
        <div className="success-notice">
          Your report has been saved. Received means the server
          acknowledged it; queued reports are still waiting to sync.
        </div>
      )}

      {loadError && (
        <p className="form-error" role="alert">
          {loadError}
        </p>
      )}

      <div className="filter-row">
        {["All", "Queued", "Received", "Resolved"].map((status) => (
          <button
            key={status}
            className={`filter-chip ${
              filter === status ? "selected" : ""
            }`}
            onClick={() => setFilter(status)}
            type="button"
          >
            {status}
          </button>
        ))}
      </div>

      {filteredReports.length === 0 ? (
        <div className="empty-state">
          <FileText size={36} />
          <h2>
            {reports.length === 0
              ? "No reports saved on this device"
              : "No reports found"}
          </h2>
          <p>
            {reports.length === 0
              ? "Reports you submit will appear here."
              : "Try another filter to find your report."}
          </p>
          <Link to="/report" className="secondary-button">
            Create a report
          </Link>
        </div>
      ) : (
        <div className="report-list">
          {filteredReports.map((report) => (
            <article
              className="report-card full-report"
              key={report.id}
            >
              <div className="report-icon">
                <BusFront size={21} />
              </div>

              <div className="report-info">
                <h3>{report.category}</h3>
                <p>{report.id}</p>

                <p>
                  {report.busNumber || "Bus not specified"}
                  {report.route ? ` · ${report.route}` : ""}
                </p>

                <small>
                  {report.createdAt
                    ? new Date(report.createdAt).toLocaleString()
                    : "Date unavailable"}
                </small>

                {report.description && (
                  <div className="report-description">
                    {report.description}
                  </div>
                )}

                {report.syncStatus !== "synced" &&
                  report.status !== "Received" &&
                  report.status !== "Resolved" && (
                    <small>Saved on device · Waiting to sync</small>
                  )}
              </div>

              <StatusBadge status={report.status} />
            </article>
          ))}
        </div>
      )}

      <Link to="/report" className="submit-button new-report-link">
        + Report another incident
      </Link>
    </div>
  );
}
