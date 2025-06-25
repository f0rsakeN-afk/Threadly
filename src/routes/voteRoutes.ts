import { RequestHandler, Router } from "express";
import { protect } from "../middlewares/authMiddleware";
import { voteOnPost } from "../controllers/voteController";

const router = Router();

router.post("/", protect as RequestHandler, voteOnPost as RequestHandler);

export default router;
