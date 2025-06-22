import { RequestHandler, Router } from "express";
import { protect } from "../middlewares/authMiddleware";
import {
  createSubReddit,
  getAllSubreddits,
} from "../controllers/subRedditController";
const router = Router();

router.get("/", getAllSubreddits);

router.use(protect as RequestHandler);
router.post("/", createSubReddit as RequestHandler);

export default router;
