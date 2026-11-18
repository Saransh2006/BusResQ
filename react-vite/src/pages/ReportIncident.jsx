
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Navigation } from "lucide-react";
import { saveReport } from "../services/db";

export default function ReportIncident() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    category: "Bus Breakdown",
    severity: "High",
    busNumber: "",
    route: "",
    description: "",
    location: "",
    contact: "",
    latitude: null,
longitude: null,
  });

  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!form.busNumber.trim() || !form.description.trim()) {
      setError("Please enter the bus number and incident description.");
      return;
    }

    setIsSaving(true);

    const report = {
  ...form,
  id: `BRQ-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  status: "Queued",
  syncStatus: "pending",
  createdAt: new Date().toISOString(),
};

    try {
      await saveReport(report);

      navigate("/reports", {
        state: { justCreated: true },
      });
    } catch (err) {
      console.error("Unable to save report:", err);
      setError(
        "Could not save this report on your device. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  }

  function useCurrentLocation() {
    if (!navigator.geolocation) {
      setError("Location is not supported by this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      
      ({ coords }) => {
        
        setForm((previous) => ({
  ...previous,
  location: `${coords.latitude.toFixed(5)}, ${coords.longitude.toFixed(5)}`,
  latitude: coords.latitude,
  longitude: coords.longitude,
}));
        setError("");
      },
      () => setError("Unable to get location. Enter it manually.")
    );
  }

  return (
    <div className="page-stack">
      <Link to="/" className="back-link">
        <ArrowLeft size={18} /> Back to home
      </Link>

      <section className="page-intro">
        <span className="eyebrow">INCIDENT REPORTING</span>
        <h1>What happened?</h1>
        <p>
          Provide the details below so the transport team can
          understand the situation.
        </p>
      </section>

      <form className="form-card" onSubmit={handleSubmit}>
        <div className="form-section-title">
          <span>01</span>
          <h2>Incident details</h2>
        </div>

        <label htmlFor="category">Incident type</label>
        <select
          id="category"
          name="category"
          value={form.category}
          onChange={handleChange}
        >
          <option>Bus Breakdown</option>
          <option>Accident</option>
          <option>Medical Emergency</option>
          <option>Safety Concern</option>
          <option>Other</option>
        </select>

        <label htmlFor="severity">Severity</label>
        <select
          id="severity"
          name="severity"
          value={form.severity}
          onChange={handleChange}
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
          <option>Critical</option>
        </select>

        <div className="form-section-title section-spaced">
          <span>02</span>
          <h2>Bus information</h2>
        </div>

        <label htmlFor="busNumber">Bus number *</label>
        <input
          id="busNumber"
          name="busNumber"
          placeholder="e.g. PB-08-2041"
          value={form.busNumber}
          onChange={handleChange}
          required
        />

        <label htmlFor="route">Route</label>
        <input
          id="route"
          name="route"
          placeholder="e.g. Route 12"
          value={form.route}
          onChange={handleChange}
        />

        <div className="form-section-title section-spaced">
          <span>03</span>
          <h2>Location and description</h2>
        </div>

        <label htmlFor="location">Incident location</label>
        <div className="input-with-icon">
          <MapPin size={18} />
          <input
            id="location"
            name="location"
            placeholder="Road, landmark or area"
            value={form.location}
            onChange={handleChange}
          />
        </div>

        <button
          className="location-button"
          type="button"
          onClick={useCurrentLocation}
        >
          <Navigation size={17} /> Use my current location
        </button>

        <label htmlFor="description">Describe the incident *</label>
        <textarea
          id="description"
          name="description"
          rows="4"
          placeholder="Explain what happened and whether anyone needs assistance."
          value={form.description}
          onChange={handleChange}
          required
        />

        <label htmlFor="contact">Contact number (optional)</label>
        <input
          id="contact"
          name="contact"
          type="tel"
          placeholder="Your contact number"
          value={form.contact}
          onChange={handleChange}
        />

        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}

        <div className="form-notice">
          Your report will be saved on this device. It has not
          been sent to transport staff or emergency services.
        </div>

        <button
          className="submit-button"
          type="submit"
          disabled={isSaving}
        >
          {isSaving ? "Saving report..." : "Save incident report"}
        </button>
      </form>
    </div>
  );
}
