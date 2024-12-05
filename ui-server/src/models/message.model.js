import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  from: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  to: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  message: {
    type: String,
    default: "",
  },
  read: {
    type: Boolean,
    default: false,
  },
}, 
{
  timestamps: true,
});

const Message = mongoose.model("Message", messageSchema);


export default Message;
