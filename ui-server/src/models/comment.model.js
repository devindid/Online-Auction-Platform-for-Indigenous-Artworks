import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  auction: { type: mongoose.Schema.Types.ObjectId, ref: "Auction", required: true },
  comment: {
    type: String,
    default: "",
  },

}, 
{
  timestamps: true,
});

const Comment = mongoose.model("Comment", commentSchema);


export default Comment;
