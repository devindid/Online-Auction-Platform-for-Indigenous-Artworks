import { Router } from "express";
import { protect, verifyAdmin, verifyUser,verifySeller } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

import {
  addMessage,
  getAllMessages
} from '../controllers/contact.controller.js';


// Add Message
router.route("/").post(
  protect,
  addMessage
);


// Get All Messages
router.route("/").get(
  protect,
  getAllMessages
);


export default router;
