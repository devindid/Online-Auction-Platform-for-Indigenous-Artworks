import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  auction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Auction",
    required: true,
  },
  bid: { type: mongoose.Schema.Types.ObjectId, ref: "Bid" },
  time: { type: Date, default: Date.now },
  amount: { type: Number, required: true },
  card: { type: String, required: true },
  brand: { type: String, required: true },
  expiry: { type: String, required: true },
},
{
  timestamps: true,
});

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
