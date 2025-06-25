import { RequestHandler, Router } from "express";
import { protect } from "../middlewares/authMiddleware";
import {
  createPost,
  getPost,
  getPostsBySubreddit,
} from "../controllers/postController";
const router = Router();

router.get("/r/:slug", getPostsBySubreddit as RequestHandler);

router.get("/:id", getPost as RequestHandler);

router.use(protect as RequestHandler);
router.post("/", createPost as RequestHandler);

export default router;
