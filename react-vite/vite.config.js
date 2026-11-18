
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "BusResQ Passenger Assistance",
        short_name: "BusResQ",
        description: "Offline-first public transport incident reporting.",
        theme_color: "#10263d",
        background_color: "#f5f7fb",
        display: "standalone",
        start_url: "/",
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,svg,png,woff2}"],
      },
    }),
  ],
});
