import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import Auction from "../models/auction.model.js";
import Bid from "../models/bid.model.js";
import City from "../models/city.model.js";
import mongoose from 'mongoose';
import { uploadOnFirebase } from "../utils/firebase.js";
import Payment from "../models/payment.model.js";
import Delivery from "../models/delivery.model.js";
import Notification from "../models/notification.model.js";


// @desc Create auction product
// @route POST /api/v1/auctions
// @access Private/ Seller only
const createAuction = asyncHandler(async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      startTime,
      endTime,
      startingPrice,
      location,
    } = req.body;
    const image = req.file?.path;

    console.log(name, "name");
    console.log(description, "description");
    console.log(category, "category");
    console.log(startTime, "startTime");
    console.log(endTime, "endTime");
    console.log(startingPrice, "startingPrice");

    if (
      !name ||
      !description ||
      !category ||
      !startTime ||
      !endTime ||
      !startingPrice ||
      !location ||
      !image
    ) {
      return res
        .status(400)
        .json(new ApiResponse(400, "All fields are required"));
    }

    if (new Date(startTime).getTime() >= new Date(endTime).getTime()) {
      return res
        .status(400)
        .json(new ApiResponse(400, "Start time must be before end time"));
    }

    if (startingPrice <= 0) {
      return res
        .status(400)
        .json(new ApiResponse(400, "Starting price must be a positive number"));
    }

    const imgUrlCloudinary = await uploadOnFirebase(image);

    if (!imgUrlCloudinary) {
      return res
        .status(500)
        .json(new ApiResponse(500, "Error uploading image"));
    }
    let currentDate=new Date();
    let status = "upcoming";
    console.log(new Date(startTime).getTime() + " and time is .." + currentDate.getTime());
    if(new Date(startTime).getTime()< currentDate.getTime()){
      status = "active";
    }
    if(endTime < currentDate.getTime()){
      status = "over";
    }

    const auction = await Auction.create({
      name,
      description,
      category,
      seller: req.user._id,
      startTime,
      endTime,
      location,
      image: imgUrlCloudinary.downloadURL,
      startingPrice,
      initialPrice: startingPrice,
      status,
    });

    if (!auction) {
      return res
        .status(500)
        .json(new ApiResponse(500, "Error creating auction"));
    }

    return res
      .status(201)
      .json(new ApiResponse(201, "Auction created successfully", auction));
  } catch (error) {
    // Handle the error
    return res
      .status(500)
      .json(new ApiResponse(500, error?.message || "Internal server error"));
  }
});

// @desc Get all auctions
// @route GET /api/v1/auctions
// @access Public

const getAllAuctions = asyncHandler(async (req, res) => {
  try {
    const { location, category, itemName } = req.body;
    console.log(req.body, "req.body");

    let filter = {
      status: { $ne: "over" },
    };
   
    if (location && !mongoose.Types.ObjectId.isValid(location)) {
      var cityid = await City.find({name: location});
      console.log(cityid[0]._id.toString(), " city id");
      if(location){
        filter.location=cityid[0]._id.toString();
      }
    } else {
      if(location){
        filter.location =  location;

      }
    }


    
    console.log(req.body, "req.body");

    if (category) filter.category = category;
    if (itemName) {
      filter.name = { $regex: itemName, $options: "i" };
    }
    console.log(filter, "filter ......");
    const auctions = await Auction.find(filter)
      .populate("seller", "fullName email phone location profilePicture")
      .populate({
        path: "winner",

        populate: {
          path: "bidder",
          select: "fullName  profilePicture",
        },
      })
      .populate("category", "name")
      .populate("location", "name")
      //show new ones
      .sort({ createdAt: -1 });

    if (!auctions) {
      return res.status(404).json(new ApiResponse(404, "No auctions found"));
    }
    return res.json(
      new ApiResponse(200, "Auctions retrieved successfully", auctions)
    );
  } catch (error) {
    // Handle the error
    return res
      .status(500)
      .json(new ApiResponse(500, error?.message || "Internal server error"));
  }
});

// @desc Get a single Auction by ID
// @route GET /api/v1/auctions/:id
// @access Public

const getSingleAuctionById = asyncHandler(async (req, res) => {
  try {
    console.log("single auction getting...");

    let auction = await Auction.findById(req.params.id)
      .populate("category")
      .populate("location")
      .populate("seller")
      .populate("bids")
      .populate({
        path: "winner",
        populate: {
          path: "bidder",
          select: "firstname lastname email profilePicture number address",
        }
      }
      )
      .populate("bids")
      .populate({
        path: "bids",
        populate: {
          path: "bidder",
          select: "fullName firstname lastname email profilePicture",
        },
      })
;

    if (!auction) {
      return res.status(404).json(new ApiResponse(404, "Auction not found"));
    }

    console.log(auction._id, "auction._id");
    const payment = await Payment.findOne({ auction: auction._id });
    
    auction = auction.toObject();
    auction.payment = payment;

    return res.json(
      new ApiResponse(200, "Auction retrieved successfully", auction)
    );
  } catch (error) {
    // Handle the error
    return res
      .status(500)
      .json(new ApiResponse(500, error?.message || "Internal server error"));
  }
});

// @desc Update auction status
// @route POST /api/v1/auctions/:id/status
// @access public

const updateAuctionStatus = asyncHandler(async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id);
    if (!auction) {
      return res.status(404).json(new ApiResponse(404, "Auction not found"));
    }
    //check start and now time and update status
    const now = new Date();

    if (now < auction.startTime) {
      auction.status = "upcoming";
    } else if (now > auction.startTime && now < auction.endTime) {
      auction.status = "active";
    } else {
      auction.status = "over";
    }

    await auction.save();
    return res.json(
      new ApiResponse(200, "Auction status updated successfully", auction)
    );
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, error?.message || "Internal server error"));
  }
});

// @desc Get all auctions of a user on which he placed bids
// @route GET /api/v1/auctions/user-bids
// @access Private

const getBidsAuctionsByUser = asyncHandler(async (req, res) => {
  try {

    const bids = await Bid.find({ bidder: req.user._id }).populate("auction")
    // populate category in auction
    .populate({
      path: "auction",
      populate: [
        {
          path: "category",
          select: "name",
         
        },
        {
          path: "seller",
          select: "fullName email number location profilePicture firstname lastname",
         
        },
        {
          path: "winner",

          populate: {
            path: "bidder",
            select: "fullName  profilePicture firstName lastName email number",
          },
        },
              ]
    })
    .sort({ createdAt: -1 });
    // it is not showing in reverse order
    

    if (!bids) {
      return res.status(404).json(new ApiResponse(404, "No bids found"));
    }

    

    return res.json(
      new ApiResponse(200, "bids retrieved successfully", bids)
    );
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, error?.message || "Internal server error"));
  }
});


// @desc Get all auctions by a user uploaded by him
// @route GET /api/v1/auctions/user-auctions
// @access Private

const getAuctionsByUser = asyncHandler(async (req, res) => {
  try {
    const auctions = await Auction
    .find({ seller: req.user._id })
    .populate(
      "category",
      "name"
    )
    .populate({
      path: "winner",
      populate: {
        path: "bidder",
        select: "fullName firstname lastname profilePicture email number address",
      }})
    .populate({
      path: "seller",
      select: "fullName firstname lastname profilePicture email number address",
    })
      .populate({
        path: "delivery",
        select: "name address phone email image",
      })
      .sort({createdAt:-1})

    if (!auctions) {
      return res.status(404).json(new ApiResponse(404, "No auctions found"));
    }

    return res.json(
      new ApiResponse(200, "Auctions retrieved successfully", {
        auctions:auctions
      })
    );
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, error?.message || "Internal server error"));
  }
});





// @desc delete auction by id
// @route DELETE /api/v1/auctions/delete/:id
// @access Private

const deleteSingleAuctionById = asyncHandler(async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id);
    if (!auction) {
      return res.status(404).json(new ApiResponse(404, "Auction not found"));
    }
    //delete all related data to this auction like bids and reviews

    const bids = await Bid.find({ auction: req.params.id });
    if (bids) {
      await Bid.deleteMany({ auction: req.params.id });
    }
console.log(auction, "auction.............");

await Auction.deleteOne({ _id: req.params.id });
return res.json(
      new ApiResponse(200, "Auction deleted successfully", auction)
    );
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, error?.message || "Internal server error"));
  }
});



// @desc update a single auction by id
// @route PUT /api/v1/auctions/update/:id
// @access Private

const updateSingleAuactionById = asyncHandler(async (req, res) => {
 

  try {
    const {
      name,
      description,
      category,
      startTime,
      endTime,
      startingPrice,
      location,
    } = req.body;
    const image = req.file?.path;

    console.log(req.body, "req.body........");
const auction = await Auction.findById(req.params.id);
if (!auction) {
  return res.status(404).json(new ApiResponse(404, "Auction not found"));
}
 // Check if startingPrice is a positive number
 if (startingPrice <= 0) {
  return res
    .status(400)
    .json(new ApiResponse(400, "Starting price must be a positive number"));
}


//check start and now time and update status accordingly
let currentDate=new Date();

 if(startTime !== auction.startTime || endTime !== auction.endTime){
  if(currentDate.getTime()>auction.startTime.getTime()){

    return res.status(400).json(new ApiResponse(400, "Auction has already started, you can't update start time or end time"));
 }
 }

 console.log("");
if(startTime > endTime){
  return res.status(400).json(new ApiResponse(400, "Start time must be before end time"));
}
if(startTime < currentDate.getTime()){
  auction.status = "active";
}else{
  auction.status = "upcoming";
}
if(auction.status === "over"){

  return res.status(400).json(new ApiResponse(400, "Auction is over, you can't update"));
}


    if(image){
    var imgUrlCloudinary = await uploadOnFirebase(image);
    if (!imgUrlCloudinary?.downloadURL) {
      return res.status(400).json(new ApiResponse(400, "Invalid image"));
    }
  }


    auction.name = name ? name : auction.name;
    auction.description = description ? description : auction.description;
    auction.category = category ? category : auction.category;
    auction.startTime = startTime ? startTime : auction.startTime;
    auction.endTime = endTime ? endTime : auction.endTime;
    auction.startingPrice = startingPrice ? startingPrice : auction.startingPrice;
    auction.location = location ? location : auction.location;

    auction.image = imgUrlCloudinary?.downloadURL
      ? imgUrlCloudinary.downloadURL
      : auction.image ;
    


    await auction.save();
    return res.status(201).json(new ApiResponse(201, "Auction Updated Successfully."))

  } catch (error) {
    console.error(error);
    res
      .status(error.statusCode || 500)
      .json(
        new ApiResponse(
          error.statusCode || 500,
          error.message || "Internal Server Error"
        )
      );
  }
});

// @desc Get auction winner
// @route GET /api/v1/auctions/:id/winner
// @access Public

const getAuctionWinner= asyncHandler(async (req, res) => {
  
  try {
    const auction = await Auction.findById(req.params.id)
    .populate(
      {
        path: "winner",
  
        populate: {
          path: "bidder",
          select: "fullName  profilePicture",
        },
      }
    )
      
    if (!auction) {
      return res.status(404).json(new ApiResponse(404, "Auction not found"));
    }
    if (auction.bids.length === 0) {
      return res.status(404).json(new ApiResponse(404, "No bids found"));
    }
    const winner={
      winnerFullName:auction?.winner?.bidder?.fullName,
      winnerProfilePicture:auction?.winner?.bidder?.profilePicture,
      winnerBidAmount:auction?.winner?.bidAmount,
      winnerBidTime:auction?.winner?.bidTime
    }

return res.status(200).json(new ApiResponse(200, "Auction winner retrieved successfully", {winner:winner}));
    
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, error?.message || "Internal server error"));
  }
});



// @desc Get LIVE 10 auctions 
// @route GET /api/v1/auctions/live
// @access Public

const getLiveAuctions = asyncHandler(async (req, res) => {
  try {
    const auctions = await Auction.find({ status: "active" })
      .limit(10)
      .populate("seller", "fullName email phone location profilePicture")
      .populate({
        path: "winner",

        populate: {
          path: "bidder",
          select: "fullName  profilePicture",
        },
      });

    if (!auctions) {
      return res.status(404).json(new ApiResponse(404, "No auctions found"));
    }
    return res.json(
      new ApiResponse(200, "Auctions retrieved successfully", auctions)
    );
  } catch (error) {
    // Handle the error
    return res
      .status(500)
      .json(new ApiResponse(500, error?.message || "Internal server error"));
  }
});


// @desc Get UPCOMING 10 auctions
// @route GET /api/v1/auctions/upcoming-auctions
// @access Public

const getUpcomingAuctions = asyncHandler(async (req, res) => {
  try {
    const auctions = await Auction.find({ status: "upcoming" })
      .limit(10)
      .populate("seller", "fullName email phone location profilePicture")
      .populate({
        path: "winner",

        populate: {
          path: "bidder",
          select: "fullName  profilePicture",
        },
      });

    if (!auctions) {
      return res.status(404).json(new ApiResponse(404, "No auctions found"));
    }
    return res.json(
      new ApiResponse(200, "Auctions retrieved successfully", auctions)
    );
  } catch (error) {
    // Handle the error
    return res
      .status(500)
      .json(new ApiResponse(500, error?.message || "Internal server error"));
  }
});


// @desc update payment status of auction
// @route PUT /api/v1/auctions/update-payment-status/:id
// @access Private

const updatePaymentStatus = asyncHandler(async (req, res) => {
  try {

    const {brand, last4, exp_month, exp_year, bid, amount} = req.body;
    const auction = await Auction.findById(req.params.id);

    if (!auction) {
      return res.status(404).json(new ApiResponse(404, "Auction not found"));
    }
    auction.paid = true;
    await auction.save();  
    
    console.log("X");

    const payment = await Payment.create({
      user: req.user._id,
      auction: auction._id,
      bid: bid,
      brand: brand,
      time: Date.now(),
      amount: amount,
      card: "xxxx-xxxx-xxxx-" + last4,
      brand: brand,
      expiry: exp_month + "/" + exp_year
    });

    console.log("X");

    var notification = {
      user: null,
      message: `${req?.user?.firstname + " " + req?.user?.lastname} has payed a ${amount}$ for ${auction?.name}`,
      type: "BID_PAYED",
      auction: auction._id,
      link: `/single-auction-detail/${auction._id}`,
    };
    await new Notification({ ...notification, user: auction.seller._id }).save();

    console.log("X");
    return res.json(
      new ApiResponse(200, "Auction payment status updated successfully", auction)
    );
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json(new ApiResponse(500, error?.message || "Internal server error"));
  }
})

const updateDeliveryPerson = asyncHandler(async (req, res) => {
  try {

    const {delivery} = req.body;
    const auction = await Auction.findById(req.params.id);

    if (!auction) {
      return res.status(404).json(new ApiResponse(404, "Auction not found"));
    }

    const person = await Delivery.findById(delivery);

    if(!person){
      return res.status(404).json(new ApiResponse(404, "Delivery Person not found"));
    }

    auction.delivery = delivery;
    await auction.save();  
    
    return res.json(
      new ApiResponse(200, "Auction delivery person updated successfully", auction)
    );
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json(new ApiResponse(500, error?.message || "Internal server error"));
  }
})


export {
  createAuction,
  getAllAuctions,
  getSingleAuctionById,
  updateAuctionStatus,
  getBidsAuctionsByUser,
  getAuctionsByUser,
  deleteSingleAuctionById,
  updateSingleAuactionById,
  getAuctionWinner,
  getLiveAuctions,
  getUpcomingAuctions,
  updatePaymentStatus,
  updateDeliveryPerson,

};
