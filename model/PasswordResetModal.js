import mongoose, { Schema } from "mongoose";

const passwordResetTokenSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "japaneseUser", 
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: 0 }, // Automatically deletes the document when expiresAt is reached
  },
});

export const PasswordResetToken = mongoose.model("PasswordResetToken", passwordResetTokenSchema);
