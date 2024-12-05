import { Router } from "express";
import { protect, verifyAdmin, verifyUser,verifySeller } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

import {
  addMessage,
  updateMessage,
  deleteMessage,
  getMessage,
  getAllUsersWithLastMessage,
  getAllMessagesWithUser,
  getAllUnreadReceivedMessages,
  markAllMessagesWithUserAsRead
} from '../controllers/message.controller.js';


// Add Message
router.route("/").post(
  protect,
  verifyUser,
  addMessage
);

// Update Message
router.route("/update/:id").put(
  protect,
  verifyUser,
  updateMessage
);

// Delete Message
router.route("/delete/:id").delete(
  protect,
  verifyUser,
  deleteMessage
);

// Get Single Message
router.route("/:id").get(
  protect,
  verifyUser,
  getMessage
);

// Get All Messages
router.route("/").get(
  protect,
  verifyUser,
  getAllUsersWithLastMessage
);

// Get All Messages with User X
router.route("/with/:userId").get(
  protect,
  verifyUser,
  getAllMessagesWithUser
);

// Get All Unread Received Messages
router.route("/unread/received").get(
  protect,
  verifyUser,
  getAllUnreadReceivedMessages
);

// Mark All Messages with User X as Read
router.route("/mark-read/:userId").put(
  protect,
  verifyUser,
  markAllMessagesWithUserAsRead
);





export default router;
