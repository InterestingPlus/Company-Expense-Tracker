// routes/report.routes.js
import express from "express";
import { getReport } from "../controllers/report.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const ReportRouter = express.Router();

ReportRouter.get("/", verifyToken, getReport);

export default ReportRouter;
