const incidentRoutes = require("./routes/incidents");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors({
  origin: [
       "http://localhost:5173", 
      "http://localhost:4173",
      "http://localhost:3000",
    ],

}));

app.use(express.json());
app.use("/api/incidents", incidentRoutes);
app.get("/", (req, res) => {
  res.json({
    message: "BusResQ API is running",
  });
});


async function startServer() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing from server/.env");
    }

    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Atlas connected successfully");

    app.listen(process.env.PORT || 5000, () => {
      console.log(
        `BusResQ server running on port ${process.env.PORT || 5000}`
      );
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
}

startServer();
