// server.js
const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/healthz", (req, res) => res.send("ok"));

// Serve static assets
app.use(express.static(path.join(__dirname, "public")));

// SPA fallback (serve index.html for any non-API route)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
