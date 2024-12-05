import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import Auction from "../models/auction.model.js";
import Bid from "../models/bid.model.js";
import City from "../models/city.model.js";
import mongoose from 'mongoose';
import { uploadOnFirebase } from "../utils/firebase.js";

import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";

// Add Message (Create)
const addMessage = asyncHandler(async (req, res) => {
  try {
    const { to, message } = req.body;

    if (!to || !message) {
      return res.status(400).json(new ApiResponse(400, "Recipient and message content are required"));
    }

    const newMessage = await Message.create({
      from: req.user._id,
      to,
      message,
    });

    if (!newMessage) {
      return res.status(500).json(new ApiResponse(500, "Error creating message"));
    }

    var notification = {
      user: null,
      message: `${req?.user?.firstname + " " + req?.user?.lastname} sent you a message`,
      type: "MESSAGE_SENT",
      auction: null,
      link: `/chat/${req.user._id}`,
    };
    await new Notification({ ...notification, user: to }).save();



    return res.status(201).json(new ApiResponse(201, "Message sent successfully", newMessage));
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, error?.message || "Internal server error"));
  }
});

// Update Message
const updateMessage = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;

    const existingMessage = await Message.findById(id);

    if (!existingMessage) {
      return res.status(404).json(new ApiResponse(404, "Message not found"));
    }

    if (existingMessage.from.toString() !== req.user._id.toString()) {
      return res.status(403).json(new ApiResponse(403, "You do not have permission to update this message"));
    }

    existingMessage.message = message || existingMessage.message;

    const updatedMessage = await existingMessage.save();

    return res.status(200).json(new ApiResponse(200, "Message updated successfully", updatedMessage));
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, error?.message || "Internal server error"));
  }
});

// Delete Message
const deleteMessage = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const message = await Message.findById(id);

    if (!message) {
      return res.status(404).json(new ApiResponse(404, "Message not found"));
    }

    if (message.from.toString() !== req.user._id.toString()) {
      return res.status(403).json(new ApiResponse(403, "You do not have permission to delete this message"));
    }

    await message.remove();

    return res.status(200).json(new ApiResponse(200, "Message deleted successfully"));
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, error?.message || "Internal server error"));
  }
});

// Get Single Message
const getMessage = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const message = await Message.findById(id).populate("from to");

    if (!message) {
      return res.status(404).json(new ApiResponse(404, "Message not found"));
    }

    return res.status(200).json(new ApiResponse(200, "Message fetched successfully", message));
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, error?.message || "Internal server error"));
  }
});

// Get All Messages (For current user)
const getAllMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ $or: [{ from: req.user._id }, { to: req.user._id }] })
      .populate("from to")
      .sort({ createdAt: -1 });

    if (!messages || messages.length === 0) {
      return res.status(404).json(new ApiResponse(404, "No messages found"));
    }

    return res.status(200).json(new ApiResponse(200, "Messages fetched successfully", messages));
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, error?.message || "Internal server error"));
  }
});

// Get All Messages with User X
const getAllMessagesWithUser = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.params;

    const messages = await Message.find({
      $or: [
        { from: req.user._id, to: userId },
        { from: userId, to: req.user._id }
      ]
    })
    .populate("from to")
    .sort({ createdAt: 1 });

    return res.status(200).json(new ApiResponse(200, "Messages fetched successfully", messages));
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, error?.message || "Internal server error"));
  }
});

// Get All Unread Received Messages
const getAllUnreadReceivedMessages = asyncHandler(async (req, res) => {
  try {
    const unreadMessages = await Message.find({ to: req.user._id, read: false }).populate("from to");

    if (!unreadMessages || unreadMessages.length === 0) {
      return res.status(404).json(new ApiResponse(404, "No unread messages found"));
    }

    return res.status(200).json(new ApiResponse(200, "Unread messages fetched successfully", unreadMessages));
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, error?.message || "Internal server error"));
  }
});

// Mark All Messages with User X as Read
const markAllMessagesWithUserAsRead = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.params;

    const updatedMessages = await Message.updateMany(
      { from: userId, to: req.user._id, read: false },
      { $set: { read: true } }
    );

    return res.status(200).json(new ApiResponse(200, "All messages with user marked as read", updatedMessages));
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, error?.message || "Internal server error"));
  }
});

const getAllUsersWithLastMessage = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUser = await User.findById(req.user._id);

    const users = await User.aggregate([
      {
        $match: { role: { $ne: currentUser.role } }
      },
      {
        $lookup: {
          from: 'messages', 
          let: { userId: '$_id' },
          pipeline: [
            { $match: { $expr: { $or: [{ $eq: ['$from', '$$userId'] }, { $eq: ['$to', '$$userId'] }] } } },
            { $sort: { createdAt: -1 } },
            { $limit: 1 } 
          ],
          as: 'lastMessage'
        }
      },
      {
        $addFields: {
          lastMessage: { $arrayElemAt: ['$lastMessage', 0] } 
        }
      },
      {
        $sort: {
          'lastMessage.createdAt': -1 
        }
      },
      {
        $project: {
          firstname: 1,
          lastname: 1,
          fullName: 1, 
          email: 1,
          lastMessage: 1,
          profilePicture: 1,
          role: 1,
          _id: 1
        }
      }
    ]);


    return res.status(200).json(new ApiResponse(200, "Messages fetched successfully", users));
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, error?.message || "Internal server error"));
  }
});



export {
  getAllMessages,
  getAllMessagesWithUser,
  getAllUsersWithLastMessage,
  getAllUnreadReceivedMessages,
  markAllMessagesWithUserAsRead,
  getMessage,
  deleteMessage,
  updateMessage,
  addMessage
};
