import express from "express";
import { registerAdmin, loginAdmin } from "../controllers/auth.controller.js";

const AdminRouter = express.Router();

AdminRouter.post("/register", registerAdmin);
AdminRouter.post("/login", loginAdmin);

export default AdminRouter;
