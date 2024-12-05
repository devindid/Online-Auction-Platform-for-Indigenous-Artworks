import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import Auction from "../models/auction.model.js";
import Request from "../models/request.model.js";
import Bid from "../models/bid.model.js";
import City from "../models/city.model.js";
import mongoose from 'mongoose';
import { uploadOnFirebase } from "../utils/firebase.js";


// Add Request (Create)
const addRequest = asyncHandler(async (req, res) => {
  try {
    const { bid, delivery, auction } = req.body;
    
    if (!bid && !delivery && !auction) {
      return res.status(400).json(new ApiResponse(400, "Bid, delivery or auction is required"));
    }

    const request = await Request.create({
      seller: req.user._id, // assuming user is the authenticated seller
      bid,
      delivery,
      auction,
      status: "Pending",
    });

    if (!request) {
      return res.status(500).json(new ApiResponse(500, "Error creating request"));
    }

    return res.status(201).json(new ApiResponse(201, "Request created successfully", request));
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, error?.message || "Internal server error"));
  }
});

// Get All Requests
const getAllRequests = asyncHandler(async (req, res) => {
  try {
    const requests = await Request.find({ seller: req.user._id }).populate("bid delivery auction");

    if (!requests || requests.length === 0) {
      return res.status(404).json(new ApiResponse(404, "No requests found"));
    }

    return res.status(200).json(new ApiResponse(200, "Requests fetched successfully", requests));
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, error?.message || "Internal server error"));
  }
});

// Get Single Request by ID
const getSingleRequestById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const request = await Request.findById(id).populate("bid delivery auction");

    if (!request) {
      return res.status(404).json(new ApiResponse(404, "Request not found"));
    }

    return res.status(200).json(new ApiResponse(200, "Request fetched successfully", request));
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, error?.message || "Internal server error"));
  }
});

// Update Request by ID
const updateRequest = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { status, bid, delivery, auction } = req.body;

    const request = await Request.findById(id);

    if (!request) {
      return res.status(404).json(new ApiResponse(404, "Request not found"));
    }

    if (request.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json(new ApiResponse(403, "You do not have permission to update this request"));
    }

    request.status = status || request.status;
    request.bid = bid || request.bid;
    request.delivery = delivery || request.delivery;
    request.auction = auction || request.auction;

    const updatedRequest = await request.save();

    return res.status(200).json(new ApiResponse(200, "Request updated successfully", updatedRequest));
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, error?.message || "Internal server error"));
  }
});

// Delete Request by ID
const deleteRequest = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const request = await Request.findById(id);

    if (!request) {
      return res.status(404).json(new ApiResponse(404, "Request not found"));
    }

    if (request.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json(new ApiResponse(403, "You do not have permission to delete this request"));
    }

    await request.remove();

    return res.status(200).json(new ApiResponse(200, "Request deleted successfully"));
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, error?.message || "Internal server error"));
  }
});




export {
  addRequest,
  getAllRequests,
  getSingleRequestById,
  updateRequest,
  deleteRequest,
};
