
const express = require("express");
const Incident = require("../models/Incident");

const router = express.Router();

// POST /api/incidents
router.post("/", async (req, res) => {
  try {
    const {
      id,
      clientReportId,
      category,
      severity,
      busNumber,
      route,
      description,
      location,
  latitude,
  longitude,
      contact,
    } = req.body;

    // Use a stable client-generated ID to prevent duplicates.
    const reportId = clientReportId || id;

    if (!reportId || !category || !busNumber || !description) {
      return res.status(400).json({
        message: "Report ID, category, bus number and description are required.",
      });
    }

    const incident = await Incident.findOneAndUpdate(
      { clientReportId: reportId },
      {
        $setOnInsert: {
          clientReportId: reportId,
          category,
          severity,
          busNumber,
          route: route || "",
          description,
          location: location || "",
          contact: contact || "",
          status: "Received",
          syncedAt: new Date(),
          latitude:
  latitude !== undefined && latitude !== null
    ? Number(latitude)
    : null,

longitude:
  longitude !== undefined && longitude !== null
    ? Number(longitude)
    : null,
        },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );

    return res.status(201).json({
      message: "Incident received successfully.",
      incident,
    });
  } catch (error) {
    console.error("Incident submission failed:", error);

    return res.status(500).json({
      message: "Unable to save incident.",
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const incidents = await Incident.find()
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      incidents,
      total: incidents.length,
    });
  } catch (error) {
    console.error("Failed to fetch incidents:", error.message);

    res.status(500).json({
      message: "Unable to fetch incidents.",
    });
  }
});

// PATCH /api/incidents/:id/status
// Update an incident's status.
router.patch("/:id/status", async (req, res) => {
  try {
    const allowedStatuses = [
      "Received",
      "Assigned",
      "In Progress",
      "Resolved",
    ];

    const { status } = req.body;

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid incident status.",
      });
    }

    const incident = await Incident.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          status,
          ...(status === "Resolved"
            ? { resolvedAt: new Date() }
            : { resolvedAt: null }),
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!incident) {
      return res.status(404).json({
        message: "Incident not found.",
      });
    }

    res.json({
      message: "Incident status updated.",
      incident,
    });
  } catch (error) {
    console.error("Failed to update incident:", error.message);

    res.status(500).json({
      message: "Unable to update incident status.",
    });
  }
});

module.exports = router;
