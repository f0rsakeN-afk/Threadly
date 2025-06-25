import { Router, RequestHandler } from "express";
import { login, register } from "../controllers/authController";
import { updatePassword } from "../controllers/userCOntroller";
import { protect } from "../middlewares/authMiddleware";
import { forgotPassword } from "../controllers/passwordController";
import { resetPassword } from "../controllers/passwordController";
import { authRateLimiter } from "../middlewares/rateLimiter";

const router = Router();

router.post("/register", authRateLimiter, register as RequestHandler);
router.post("/login", authRateLimiter, login as RequestHandler);

router.post("/resetPassword", authRateLimiter, resetPassword as RequestHandler);
router.post(
  "/forgotPassword",
  authRateLimiter,
  forgotPassword as RequestHandler
);

router.use(protect as RequestHandler);

router.patch("/updatePassword", updatePassword as RequestHandler);

export default router;
