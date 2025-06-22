import { RequestHandler, Router } from "express";
import { protect } from "../middlewares/authMiddleware";
import {
  createSubReddit,
  getAllSubreddits,
  updateSubreddit,
  deleteSubreddit,
} from "../controllers/subRedditController";
import { isSubredditCreator } from "../middlewares/ownerShip";
const router = Router();

router.get("/", getAllSubreddits);

router.use(protect as RequestHandler);
router.post("/", createSubReddit as RequestHandler);

router.use(isSubredditCreator as RequestHandler);

router.patch("/:id", updateSubreddit as RequestHandler);
router.delete("/:id", deleteSubreddit as RequestHandler);

export default router;
