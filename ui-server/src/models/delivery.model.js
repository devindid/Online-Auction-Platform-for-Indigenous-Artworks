import mongoose from "mongoose";

const deliverySchema = new mongoose.Schema({
  name: { type: String, required: true },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  image:{type:String,required:true},
  email: { type: String, required: true },
  phone: { type: String, required: true },
  NIC: { type: String, required: true },
  address: { type: String, required: true }

}, 
{
  timestamps: true,
});

const Delivery = mongoose.model("Delivery", deliverySchema);


export default Delivery;