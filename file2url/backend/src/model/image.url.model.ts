import mongoose from "mongoose";
import User from "./user.model";

const imageUrlSchema = new mongoose.Schema({
  url: [
    {
      public_id: String,
      url: String,
    }
  ],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    default:123456,
    ref: "User",
    required: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

const ImageUrl = mongoose.model("ImageUrl", imageUrlSchema);
export default ImageUrl;
