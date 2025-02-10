const express = require("express");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = 8000;
app.use(cors());

// Helper function to simulate latency
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock data
const mockData = {
  "cache-first": { message: "Cache First Data" },
  "network-first": { message: "Network First Data" },
  "stale-while-revalidate": {
    message: "Stale While Revalidate Data",
  },
};

// API endpoints
app.get("/api/cache-first", async (req, res) => {
  await delay(500);
  res.json({ ...mockData["cache-first"], random: Math.random() });
});

app.get("/api/network-first", async (req, res) => {
  await delay(500);
  res.json({ ...mockData["network-first"], random: Math.random() });
});

app.get("/api/stale-while-revalidate", async (req, res) => {
  await delay(5000);
  res.json({ ...mockData["stale-while-revalidate"], random: Math.random() });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
