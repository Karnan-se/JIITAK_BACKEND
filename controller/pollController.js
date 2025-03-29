import Vote from "../model/VoteModal.js";
import AppError from "../utils/appError.js";

export const votedUser = async (req, res, next) => {
  try {
    const { userId } = req.query;
    console.log(req.query)
    console.log(userId);
    if (!userId) throw AppError.conflict("no userDEtails Find");
    const VotedUser = await Vote.find({ userId: userId });
    console.log(VotedUser, "Voted User");
    res.status(200).json({VotedUser})
  } catch (error) {
    console.log(error);
    next(error)
  }
};
