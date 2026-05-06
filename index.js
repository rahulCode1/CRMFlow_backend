require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const HttpError = require("./models/http-error");
const leadsRoutes = require("./routes/lead-routs");
const { initializeDb } = require("./data/db.connect");
const errorHandler = require("./middlewares/errorHandler");
const salesAgentRoute = require("./routes/salesAgent-route");
const reportRoute = require("./routes/report-route");
const tagRoute = require("./routes/tag-route");

initializeDb();

app.use(cors());
const allowedOrigins = [
  "http://localhost:3000",
  "https://major-project2-backend-sand.vercel.app/api",
];

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  );

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE OPTIONS",
  );

  next();
});

app.use(express.json());

app.use("/api/leads", leadsRoutes);
app.use("/api/agents", salesAgentRoute);
app.use("/api/report", reportRoute);
app.use("/api/tags", tagRoute);

app.use((req, res, next) => {
  next(new HttpError("This route doesn't exist.", 404));
});

app.use(errorHandler);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
