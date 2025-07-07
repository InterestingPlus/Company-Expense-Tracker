import express from "express";
import {
  registerAdmin,
  loginAdmin,
  editAdmin,
} from "../controllers/auth.controller.js";

import { verifyToken } from "../middleware/auth.middleware.js";

const AdminRouter = express.Router();

AdminRouter.post("/register", registerAdmin);
AdminRouter.post("/login", loginAdmin);
AdminRouter.put("/", verifyToken, editAdmin);

export default AdminRouter;
