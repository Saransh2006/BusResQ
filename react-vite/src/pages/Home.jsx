import { Link } from "react-router-dom";
import {
  ArrowRight,
  BusFront,
  CheckCircle2,
  Clock3,
  FilePlus2,
  ShieldCheck,
} from "lucide-react";
import { initialReports } from "../data/reports";
import StatusBadge from "../components/StatusBadge";

export default function Home() {
  const pending = initialReports.filter(
    (report) => report.syncStatus !== "synced"
  ).length;

  const received = initialReports.filter(
    (report) => report.syncStatus === "synced"
  ).length;

  return (
    <div className="page-stack">
      <section className="welcome">
        <span className="eyebrow">PASSENGER ASSISTANCE</span>
        <h1>We're here to help.</h1>
        <p>
          Report a bus breakdown or emergency to the transport
          team, wherever your journey takes you.
        </p>

        <Link to="/report" className="sos-button">
          <span className="sos-icon">
            <FilePlus2 size={24} />
          </span>
          <span>
            <strong>Report an incident</strong>
            <small>Breakdown · Accident · Medical SOS</small>
          </span>
          <ArrowRight className="sos-arrow" size={21} />
        </Link>

        <div className="safety-note">
          <ShieldCheck size={17} />
          <span>
            Reports saved offline will sync when connectivity returns.
          </span>
        </div>
      </section>

      <section className="stats-grid">
        <article className="stat-card">
          <div className="stat-icon warning-icon">
            <Clock3 size={20} />
          </div>
          <h2>{pending.toString().padStart(2, "0")}</h2>
          <p>Waiting to sync</p>
        </article>

        <article className="stat-card">
          <div className="stat-icon success-icon">
            <CheckCircle2 size={20} />
          </div>
          <h2>{received.toString().padStart(2, "0")}</h2>
          <p>Synced reports</p>
        </article>
      </section>

      <section className="section">
        <div className="section-heading">
          <div>
            <h2>Recent reports</h2>
            <p>Keep track of your incident reports.</p>
          </div>
          <Link to="/reports" className="text-link">
            View all <ArrowRight size={15} />
          </Link>
        </div>

        <div className="report-list">
          {initialReports.slice(0, 2).map((report) => (
            <article className="report-card" key={report.id}>
              <div className="report-icon">
                <BusFront size={21} />
              </div>

              <div className="report-info">
                <h3>{report.category}</h3>
                <p>
                  {report.id} · {report.route}
                </p>
                <small>{report.createdAt}</small>
              </div>

              <StatusBadge status={report.status} />
            </article>
          ))}
        </div>
      </section>

      <section className="help-card">
        <div>
          <h3>Need assistance?</h3>
          <p>Learn how to report and track an incident.</p>
        </div>
        <ShieldCheck size={25} />
      </section>
    </div>
  );
}