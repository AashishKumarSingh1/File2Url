import mongoose from "mongoose";
import User from "./user.model";
const pdfUrlSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

const PdfUrl = mongoose.model("PdfUrl", pdfUrlSchema);
export default PdfUrl;
