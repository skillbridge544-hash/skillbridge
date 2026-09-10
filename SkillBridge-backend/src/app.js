const express = require("express");
const cors = require("cors");
const { errorHandler } = require("./middleware/error");
const authRoutes = require("./routes/auth");
const usersRoutes = require("./routes/users");
const skillsRoutes = require("./routes/skills");
const projectsRoutes = require("./routes/projects");
const opportunitiesRoutes = require("./routes/opportunities");
const passportRoutes = require("./routes/passport");
const mentorsRoutes = require("./routes/mentors");
const messagesRoutes = require("./routes/messages");
const domainesRoutes = require("./routes/domaines");

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(",") : true,
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "skillbridge-api" });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/skills", skillsRoutes);
app.use("/api/projects", projectsRoutes);
app.use("/api/opportunities", opportunitiesRoutes);
app.use("/api/passport", passportRoutes);
app.use("/api", mentorsRoutes);
app.use("/api/messages", messagesRoutes);
app.use("/api/domaines", domainesRoutes);

app.use((_req, res) => {
  res.status(404).json({ message: "Route introuvable." });
});

app.use(errorHandler);

module.exports = app;
