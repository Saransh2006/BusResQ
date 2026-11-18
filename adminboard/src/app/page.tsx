
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import IncidentMapLoader from "./components/IncidentMapLoader";
import type { MapIncident } from "./components/IncidentMap";

type Incident = {
  _id: string;
  clientReportId: string;
  category: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  busNumber: string;
  route: string;
  description: string;
  location: string;
  status: "Received" | "Assigned" | "In Progress" | "Resolved";
  createdAt: string;
};

const API = "http://localhost:5000/api/incidents";

const statuses = [
  "Received",
  "Assigned",
  "In Progress",
  "Resolved",
] as const;

export default function Dashboard() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [search, setSearch] = useState("");
  const [severity, setSeverity] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadIncidents = useCallback(async () => {
    try {
      setError("");

      const response = await fetch(API, {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      setIncidents(data.incidents ?? []);
    } catch {
      setError(
        "Could not load incidents. Check that the Express server is running."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadIncidents()
  }, [loadIncidents]);

  async function updateStatus(id: string, status: string) {
    try {
      setError("");

      const response = await fetch(`${API}/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error("Status update failed");
      }

      const data = await response.json();

      setIncidents((previous) =>
        previous.map((incident) =>
          incident._id === id ? data.incident : incident
        )
      );
    } catch {
      setError("Unable to update status. Please try again.");
    }
  }

  const filtered = useMemo(() => {
    const query = search.toLowerCase();

    return incidents.filter((incident) => {
      const matchesSearch = [
        incident.category,
        incident.busNumber,
        incident.route,
        incident.location,
        incident.clientReportId,
      ]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query));

      const matchesSeverity =
        severity === "All" || incident.severity === severity;

      return matchesSearch && matchesSeverity;
    });
  }, [incidents, search, severity]);

  

const mappableIncidents = useMemo<MapIncident[]>(() => {
  return incidents.flatMap((incident) => {
    let latitude = Number(
      (incident as Incident & { latitude?: number }).latitude
    );

    let longitude = Number(
      (incident as Incident & { longitude?: number }).longitude
    );

    // Backward compatibility with older reports that stored
    // coordinates only as "latitude, longitude" in location.
    if (
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude)
    ) {
      const match = incident.location?.match(
        /^\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*$/
      );

      if (!match) return [];

      latitude = Number(match[1]);
      longitude = Number(match[2]);
    }

    if (
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude) ||
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      return [];
    }

    return [{
      ...incident,
      latitude,
      longitude,
    }];
  });
}, [incidents]);


  const received = incidents.filter(
    (incident) => incident.status === "Received"
  ).length;

  const active = incidents.filter(
    (incident) =>
      incident.status === "Assigned" ||
      incident.status === "In Progress"
  ).length;

  const resolved = incidents.filter(
    (incident) => incident.status === "Resolved"
  ).length;

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <header className="bg-slate-950 px-6 py-5 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div>
            <p className="text-xl font-bold tracking-tight">BusResQ</p>
            <p className="text-sm text-slate-400">
              Transport Operations Dashboard
            </p>
          </div>

          <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-sm text-emerald-300">
            Admin Console
          </span>
        </div>
      </header>

      <div className="mx-auto max-w-7xl space-y-7 px-5 py-8">
        <section>
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-700">
            Incident management
          </p>
          <h1 className="mt-2 text-3xl font-bold">
            Operations overview
          </h1>
          <p className="mt-2 text-slate-500">
            Review passenger reports and manage incident progress.
          </p>
        </section>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: "Total incidents",
              value: incidents.length,
              color: "border-slate-300",
            },
            {
              label: "Awaiting action",
              value: received,
              color: "border-amber-400",
            },
            {
              label: "Active incidents",
              value: active,
              color: "border-blue-500",
            },
            {
              label: "Resolved",
              value: resolved,
              color: "border-emerald-500",
            },
          ].map((card) => (
            <article
              key={card.label}
              className={`rounded-xl border-t-4 ${card.color} bg-white p-5 shadow-sm`}
            >
              <p className="text-sm text-slate-500">{card.label}</p>
              <p className="mt-3 text-3xl font-bold">{card.value}</p>
            </article>
          ))}
        </section>

<section className="rounded-xl bg-white p-5 shadow-sm sm:p-6">
  <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <h2 className="text-xl font-bold">Live incident map</h2>
      <p className="mt-1 text-sm text-slate-500">
        {mappableIncidents.length} incidents with GPS coordinates
      </p>
    </div>

    <div className="flex flex-wrap gap-3 text-xs font-medium">
      <span className="text-red-600">● Critical</span>
      <span className="text-orange-600">● High</span>
      <span className="text-amber-600">● Medium</span>
      <span className="text-green-600">● Low</span>
    </div>
  </div>

  <IncidentMapLoader incidents={mappableIncidents} />

  {mappableIncidents.length === 0 && (
    <p className="mt-3 text-sm text-slate-500">
      No GPS-based incidents yet. Submit a report using
      &quot;Use my current location&quot; in the passenger app
      to see a marker here.
    </p>
  )}
</section>


        <section className="rounded-xl bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-xl font-bold">Incident reports</h2>
              <p className="mt-1 text-sm text-slate-500">
                {filtered.length} reports found
              </p>
            </div>

            <button
              onClick={loadIncidents}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold hover:bg-slate-50"
            >
              Refresh reports
            </button>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search bus, route or report ID..."
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
            />

            <select
              value={severity}
              onChange={(event) => setSeverity(event.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-4 py-3"
            >
              <option>All</option>
              <option>Critical</option>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </div>

          {error && (
            <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {error}
            </p>
          )}

          {loading ? (
            <p className="py-12 text-center text-slate-500">
              Loading incidents...
            </p>
          ) : filtered.length === 0 ? (
            <p className="py-12 text-center text-slate-500">
              No incidents match your filters.
            </p>
          ) : (
            <div className="mt-5 space-y-3">
              {filtered.map((incident) => (
                <article
                  key={incident._id}
                  className="rounded-xl border border-slate-200 p-4 transition hover:border-slate-300 sm:p-5"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold">
                          {incident.category}
                        </h3>

                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          incident.severity === "Critical"
                            ? "bg-red-100 text-red-700"
                            : incident.severity === "High"
                              ? "bg-orange-100 text-orange-700"
                              : incident.severity === "Medium"
                                ? "bg-amber-100 text-amber-700"
                                : "bg-slate-100 text-slate-600"
                        }`}>
                          {incident.severity}
                        </span>
                      </div>

                      <p className="mt-2 break-all text-xs text-slate-500">
                        {incident.clientReportId}
                      </p>

                      <p className="mt-2 text-sm text-slate-600">
                        Bus: {incident.busNumber}
                        {incident.route ? ` · ${incident.route}` : ""}
                      </p>

                      <p className="mt-2 whitespace-pre-wrap text-sm">
                        {incident.description}
                      </p>

                      {incident.location && (
                        <p className="mt-2 text-sm text-slate-500">
                          Location: {incident.location}
                        </p>
                      )}

                      <p className="mt-2 text-xs text-slate-400">
                        {new Date(incident.createdAt).toLocaleString()}
                      </p>
                    </div>

                    <div className="w-full lg:w-48">
                      <label
                        htmlFor={`status-${incident._id}`}
                        className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500"
                      >
                        Incident status
                      </label>

                      <select
                        id={`status-${incident._id}`}
                        value={incident.status}
                        onChange={(event) =>
                          updateStatus(incident._id, event.target.value)
                        }
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm"
                      >
                        {statuses.map((status) => (
                          <option key={status}>{status}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <footer className="pb-5 text-center text-xs text-slate-400">
          BusResQ · Transport incident management
        </footer>
      </div>
    </main>
  );
}
