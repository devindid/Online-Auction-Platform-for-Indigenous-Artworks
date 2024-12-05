import { Router } from "express";
import { protect, verifyUser,verifySeller } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

import {
  addComment,
  updateComment,
  deleteComment,
  getComment,
  getCommentsForAuction
} from "../controllers/comment.controller.js";

const router = Router();

router.route("/").post(protect, verifyUser, addComment);
router.route("/update/:id").put(protect, verifyUser, updateComment);
router.route("/delete/:id").delete(protect, verifyUser, deleteComment);
router.route("/:id").get(protect, verifyUser, getComment);
router.route("/auction/:auctionId").get(protect, verifyUser, getCommentsForAuction);

export default router;