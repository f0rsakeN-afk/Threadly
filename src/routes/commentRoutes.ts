import { RequestHandler, Router } from "express";
import {
  createComment,
  deleteComment,
  getCommentsByPost,
  updateComment,
} from "../controllers/commentController";
import { protect } from "../middlewares/authMiddleware";
import { isCommentOwner } from "../middlewares/ownerShip";
const router = Router();

router.get("/:postId", getCommentsByPost as RequestHandler);

router.use(protect as RequestHandler);

router.post("/", createComment as RequestHandler);

router.patch(
  "/:id",
  isCommentOwner as RequestHandler,
  updateComment as RequestHandler
);

router.delete(
  "/:id",
  isCommentOwner as RequestHandler,
  deleteComment as RequestHandler
);

export default router;
