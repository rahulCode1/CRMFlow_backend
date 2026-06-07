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
const authRoutes = require("./routes/auth-routes");

initializeDb();
const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

app.use(authRoutes);
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
