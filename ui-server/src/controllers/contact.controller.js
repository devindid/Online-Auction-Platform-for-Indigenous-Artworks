import { asyncHandler } from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

import Contact from "../models/contact.model.js";

// Add Message (Create)
const addMessage = asyncHandler(async (req, res) => {
  try {
    const { name, email, message } = req.body;
    console.log({name, email, message});

    if (!name || !message || !email) {
      return res.status(400).json(new ApiResponse(400, "Fill all details."));
    }

    const newMessage = await Contact.create({
      name, email, message
    });

    if (!newMessage) {
      return res.status(500).json(new ApiResponse(500, "Error creating message"));
    }

    return res.status(201).json(new ApiResponse(201, "Message sent successfully", newMessage));
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, error?.message || "Internal server error"));
  }
});

// Get All Messages (For current user)
const getAllMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Contact.find()
      .sort({ createdAt: -1 });
      
    if (!messages) {
      return res.status(404).json(new ApiResponse(404, "No messages found"));
    }

    return res.status(200).json(new ApiResponse(200, "Messages fetched successfully", messages));
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, error?.message || "Internal server error"));
  }
});

export {
  getAllMessages,
  addMessage
};
