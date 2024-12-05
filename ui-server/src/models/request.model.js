import mongoose from "mongoose";

const requestSchema = new mongoose.Schema({
  seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  bid: { type: mongoose.Schema.Types.ObjectId, ref: "Bid" },
  delivery: { type: mongoose.Schema.Types.ObjectId, ref: "Delivery" },
  auction: { type: mongoose.Schema.Types.ObjectId, ref: "Auction" },
  status: {
    type: String,
    default: "Pending",
  },
}, 
{
  timestamps: true,
});

const Request = mongoose.model("Request", requestSchema);


export default Request;
