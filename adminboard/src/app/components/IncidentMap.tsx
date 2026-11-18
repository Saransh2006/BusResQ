
"use client";

import { CircleMarker, MapContainer, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export type MapIncident = {
  _id: string;
  category: string;
  severity: string;
  busNumber: string;
  location: string;
  status: string;
  latitude: number;
  longitude: number;
};

type Props = {
  incidents: MapIncident[];
};

function markerColor(severity: string) {
  switch (severity) {
    case "Critical":
      return "#dc2626";
    case "High":
      return "#ea580c";
    case "Medium":
      return "#d97706";
    default:
      return "#16a34a";
  }
}

export default function IncidentMap({ incidents }: Props) {
  const center: [number, number] =
    incidents.length > 0
      ? [incidents[0].latitude, incidents[0].longitude]
      : [20.5937, 78.9629];

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200">
      <MapContainer
        center={center}
        zoom={incidents.length > 0 ? 11 : 5}
        scrollWheelZoom
        className="h-[420px] w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {incidents.map((incident) => (
          <CircleMarker
            key={incident._id}
            center={[incident.latitude, incident.longitude]}
            radius={9}
            pathOptions={{
              color: "#ffffff",
              weight: 2,
              fillColor: markerColor(incident.severity),
              fillOpacity: 0.95,
            }}
          >
            <Popup>
              <div style={{ minWidth: 170 }}>
                <strong>{incident.category}</strong>
                <p>Bus: {incident.busNumber}</p>
                <p>Severity: {incident.severity}</p>
                <p>Status: {incident.status}</p>
                <p>Location: {incident.location}</p>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
