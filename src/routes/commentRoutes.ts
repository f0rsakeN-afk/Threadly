import { RequestHandler, Router } from "express";
import {
  createComment,
  getCommentsByPost,
} from "../controllers/commentController";
import { protect } from "../middlewares/authMiddleware";
const router = Router();

router.get("/:postId", getCommentsByPost as RequestHandler);

router.use(protect as RequestHandler);

router.post("/", createComment as RequestHandler);

export default router;
