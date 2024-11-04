import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    sender: { type: String, enum: ['user', 'admin'] },
    content: String,
    timestamp: { type: Date, default: Date.now },
  });
  
  const Message = mongoose.model('Message', messageSchema);
  export default Message;