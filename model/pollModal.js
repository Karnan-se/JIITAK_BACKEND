import mongoose from "mongoose";

const PollSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    duration: {
      type: Number,
      required: true,
      default: 60, 
    },
    isPrivate: {
      type: Boolean,
      default: false,
    },
    options: [
      {
        text: { type: String, required: true, trim: true },
        votes: { type: Number, default: 0 },
      },
    ],
    allowedUsers: [
      {
        type: String, 
        trim: true,
        lowercase: true,
      },
    ],
  },
  { timestamps: true }
);

const Poll = mongoose.model("Poll", PollSchema);
export default Poll;
