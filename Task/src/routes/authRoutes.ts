import express from "express";
import {
  getTimeAPI,
  kickOutAPI,
  login,
  oneTimeLink,
  verifyLink,
} from "../controllers/authController";
import { rateLimiterMiddleware } from "../utils/rateLimiter";
import { admin, protect } from "../middlewares/authMiddleware";
import { loginValidation } from "../validators/authValidator";

const router = express.Router();

router.post("/login", loginValidation, rateLimiterMiddleware, login);
router.post("/one-time-link", rateLimiterMiddleware, protect, oneTimeLink);
router.get("/verify-link", rateLimiterMiddleware, protect, verifyLink);
router.get("/get-time-api", rateLimiterMiddleware, protect, getTimeAPI);
router.post("/kick-out", rateLimiterMiddleware, admin, kickOutAPI);

export default router;
