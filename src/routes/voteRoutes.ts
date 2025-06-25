import { RequestHandler, Router } from "express";
import { protect } from "../middlewares/authMiddleware";
import { onVotePost } from "../controllers/voteController";

const router = Router();

router.post("/", protect as RequestHandler, onVotePost as RequestHandler);

export default router;
