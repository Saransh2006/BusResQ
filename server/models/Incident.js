
const mongoose = require("mongoose");

const incidentSchema = new mongoose.Schema(
  {
    clientReportId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    severity: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      default: "Medium",
    },

    busNumber: {
      type: String,
      required: true,
      trim: true,
    },

    route: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

  
    location: {
      type: String,
      default: "",
    },


    latitude: {
      type: Number,
      min: -90,
      max: 90,
      default: null,
    },

    longitude: {
      type: Number,
      min: -180,
      max: 180,
      default: null,
    },

    contact: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["Received", "Assigned", "In Progress", "Resolved"],
      default: "Received",
    },

    syncedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Incident", incidentSchema);
