import mongoose from "mongoose";

const auctionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String , required: true},
  category: { type: mongoose.Schema.Types.ObjectId, ref: "ProductCategory", required: true},
  seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  bids: [{ type: mongoose.Schema.Types.ObjectId, ref: "Bid" }],
  winner: { type: mongoose.Schema.Types.ObjectId, ref: "Bid" },
  status: {
    type: String
   
  },
  location: {type: String, default: "Sri Lanka" },
  image:{type:String,required:true},
  startingPrice: { type: Number, required: true },
  initialPrice: { type: Number, required: true , default:0},
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
  paid:{
    type:Boolean,
    default:false
  },
  delivery: { type: mongoose.Schema.Types.ObjectId, ref: "Delivery" },
  
}, 
{
  timestamps: true,
});

const Auction = mongoose.model("Auction", auctionSchema);


export default Auction;