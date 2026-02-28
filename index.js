import express from "express";
import morgan from "morgan";
import cors from "cors";

import entities from "./src/routes/entitiesRoutes.js";
import clients from "./src/routes/clientsRoutes.js";
import drivers from "./src/routes/driversRoutes.js";
import licenses from "./src/routes/licensesRoutes.js";
import exams from "./src/routes/examsRoutes.js";
import infractions from "./src/routes/infractionsRoutes.js";
import center from "./src/routes/centerRoutes.js";
import reports from "./src/routes/reportsRoutes.js";
import workers from "./src/routes/workersRoutes.js";
import dashboard from "./src/routes/dashboardRoutes.js";
import auth from "./src/routes/authRoutes.js";

const app = express();

app.use(cors({
  origin: ["http://localhost:5173", "https://licenses-management-system-frontend.vercel.app"],
  credentials: true,
}));
app.use(morgan("dev"));
app.use(express.json());
app.use(auth);
app.use(entities);
app.use(clients);
app.use(drivers);
app.use(licenses);
app.use(exams);
app.use(infractions);
app.use(center);
app.use(reports);
app.use(workers);
app.use(dashboard);

export default app;
