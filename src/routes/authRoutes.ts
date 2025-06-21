import { Router, RequestHandler } from "express";
import { login, register } from "../controllers/authController";
import { updatePassword } from "../controllers/userCOntroller";
import { protect } from "../middlewares/authMiddleware";
import { forgotPassword } from "../controllers/passwordController";
import { resetPassword } from "../controllers/passwordController";

const router = Router();

router.post("/register", register as RequestHandler);
router.post("/login", login as RequestHandler);

router.post("/resetPassword", resetPassword as RequestHandler);
router.post("/forgotPassword", forgotPassword as RequestHandler);

router.use(protect as RequestHandler);

router.patch("/updatePassword", updatePassword as RequestHandler);

export default router;
