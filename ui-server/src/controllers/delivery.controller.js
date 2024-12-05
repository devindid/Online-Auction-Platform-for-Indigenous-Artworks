import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import Auction from "../models/auction.model.js";
import Bid from "../models/bid.model.js";
import City from "../models/city.model.js";
import Delivery from "../models/delivery.model.js";
import mongoose from 'mongoose';
import { uploadOnFirebase } from "../utils/firebase.js";



const addDelivery = asyncHandler(async (req, res) => {

  try {
    const {
      name,
      email,
      phone,
      NIC,
      address

    } = req.body;
    const image = req.file?.path;



    if (
      !name ||
      !email ||
      !phone ||
      !NIC ||
      !address ||
      !image
    ) {
      return res
        .status(400)
        .json(new ApiResponse(400, "All fields are required"));
    }

    const imgUrlCloudinary = await uploadOnFirebase(image);

    if (!imgUrlCloudinary) {
      return res
        .status(500)
        .json(new ApiResponse(500, "Error uploading image"));
    }


    const delivery = await Delivery.create({
      name,
      seller: req.user._id,
      image: imgUrlCloudinary.downloadURL,
      email,
      phone,
      NIC,
      address,
    });

    if (!delivery) {
      return res
        .status(500)
        .json(new ApiResponse(500, "Error creating delivery"));
    }

    return res
      .status(201)
      .json(new ApiResponse(201, "Delivery created successfully", delivery));
  } catch (error) {
    // Handle the error
    return res
      .status(500)
      .json(new ApiResponse(500, error?.message || "Internal server error"));
  }
});

// Get all deliveries
const getAllDeliveries = asyncHandler(async (req, res) => {
  try {
    const deliveries = await Delivery.find({ seller: req.user._id });

    return res.status(200).json(new ApiResponse(200, "Deliveries fetched successfully", deliveries));
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, error?.message || "Internal server error"));
  }
});

// Update a delivery
const updateDelivery = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, NIC, address } = req.body;

    const delivery = await Delivery.findById(id);

    if (!delivery) {
      return res.status(404).json(new ApiResponse(404, "Delivery not found"));
    }

    if (delivery.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json(new ApiResponse(403, "You do not have permission to update this delivery"));
    }

    const image = req.file?.path;
    let imgUrlCloudinary = delivery.image;

    if (image) {
      const uploadResult = await uploadOnFirebase(image);
      if (!uploadResult) {
        return res.status(500).json(new ApiResponse(500, "Error uploading image"));
      }
      imgUrlCloudinary = uploadResult.downloadURL;
    }

    delivery.name = name || delivery.name;
    delivery.email = email || delivery.email;
    delivery.phone = phone || delivery.phone;
    delivery.NIC = NIC || delivery.NIC;
    delivery.address = address || delivery.address;
    delivery.image = imgUrlCloudinary;

    const updatedDelivery = await delivery.save();

    return res.status(200).json(new ApiResponse(200, "Delivery updated successfully", updatedDelivery));
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, error?.message || "Internal server error"));
  }
});

// Delete a delivery
const deleteDelivery = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const delivery = await Delivery.findById(id);

    if (!delivery) {
      return res.status(404).json(new ApiResponse(404, "Delivery not found"));
    }

    if (delivery.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json(new ApiResponse(403, "You do not have permission to delete this delivery"));
    }

    await Delivery.deleteOne({ _id: id });

    return res.status(200).json(new ApiResponse(200, "Delivery deleted successfully"));
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, error?.message || "Internal server error"));
  }
});

// Get single delivery by ID
const getSingleDeliveryById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const delivery = await Delivery.findById(id);

    if (!delivery) {
      return res.status(404).json(new ApiResponse(404, "Delivery not found"));
    }

    return res.status(200).json(new ApiResponse(200, "Delivery fetched successfully", delivery));
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, error?.message || "Internal server error"));
  }
});

export {
  addDelivery,
  getAllDeliveries,
  updateDelivery,
  deleteDelivery,
  getSingleDeliveryById,
};
