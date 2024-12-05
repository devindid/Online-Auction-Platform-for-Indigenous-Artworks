import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import Auction from "../models/auction.model.js";
import Bid from "../models/bid.model.js";
import City from "../models/city.model.js";
import mongoose from 'mongoose';
import { uploadOnFirebase } from "../utils/firebase.js";

import Comment from "../models/comment.model.js";

// Add Comment
const addComment = asyncHandler(async (req, res) => {
  try {
    const { auction, comment } = req.body;

    const newComment = new Comment({
      user: req.user._id,
      auction,
      comment,
    });

    const savedComment = await newComment.save();
    return res.status(201).json(new ApiResponse(201, "Comment added successfully", savedComment));
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, error?.message || "Internal server error"));
  }
});

// Update Comment
const updateComment = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { comment } = req.body;

    const existingComment = await Comment.findById(id);

    if (!existingComment) {
      return res.status(404).json(new ApiResponse(404, "Comment not found"));
    }

    if (existingComment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json(new ApiResponse(403, "You do not have permission to update this comment"));
    }

    existingComment.comment = comment || existingComment.comment;

    const updatedComment = await existingComment.save();

    return res.status(200).json(new ApiResponse(200, "Comment updated successfully", updatedComment));
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, error?.message || "Internal server error"));
  }
});

// Delete Comment
const deleteComment = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json(new ApiResponse(404, "Comment not found"));
    }

    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json(new ApiResponse(403, "You do not have permission to delete this comment"));
    }

    await comment.remove();

    return res.status(200).json(new ApiResponse(200, "Comment deleted successfully"));
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, error?.message || "Internal server error"));
  }
});

// Get Single Comment
const getComment = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findById(id).populate("user auction");

    if (!comment) {
      return res.status(404).json(new ApiResponse(404, "Comment not found"));
    }

    return res.status(200).json(new ApiResponse(200, "Comment fetched successfully", comment));
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, error?.message || "Internal server error"));
  }
});

// Get All Comments for a Specific Auction
const getCommentsForAuction = asyncHandler(async (req, res) => {
  try {
    const { auctionId } = req.params;

    const comments = await Comment.find({ auction: auctionId }).populate("user").sort({ createdAt: -1 });

    return res.status(200).json(new ApiResponse(200, "Comments fetched successfully", comments));
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, error?.message || "Internal server error"));
  }
});

export { addComment, updateComment, deleteComment, getComment, getCommentsForAuction };
