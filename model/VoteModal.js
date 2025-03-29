import mongoose from "mongoose"

const VoteSchema = new mongoose.Schema(
  {
    pollId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Poll",
      required: true,
      index: true,
    },
    userId: {
      type: String, 
      required: true,
      trim: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
)

VoteSchema.index({ pollId: 1, userId: 1 }, { unique: true })

const Vote = mongoose.model("Vote", VoteSchema)
export default Vote

