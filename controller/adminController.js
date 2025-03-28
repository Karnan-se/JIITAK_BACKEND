import Poll from "../model/pollModal.js"
import AppError from "../utils/appError.js"
import { savePoll } from "../repository/pollRepository.js"
import { getPoll } from "../repository/pollRepository.js"
import { updatePoll } from "../repository/pollRepository.js"


export const createPoll = async(req, res, next)=>{
    try {
        const {pollDetail} = req.body
        console.log(pollDetail , "pollDetail")
        if(!pollDetail){
            throw AppError.conflict("error Creating new Poll")
        }
        pollDetail.options = pollDetail.options.map(option => ({ text: option, votes: 0 }));
        const poll = await savePoll(pollDetail)

        res.status(200).json({poll})
        
    } catch (error) {
        console.log(error)
        next(error)
    }
}



export const getPolls = async (req, res , next) => {
    try {
      const polls = await getPoll()
  
      const now = new Date();
  
      const formattedPolls = polls.map(poll => {
        const createdAt = new Date(poll.createdAt);
        const pollEndTime = new Date(createdAt.getTime() + poll.duration * 60000);
        const isActive = now < pollEndTime;
  
        return {
          id: poll._id.toString(),
          title: poll.title,
          description: poll.description,
          totalVotes: poll.options.reduce((acc, option) => acc + option.votes, 0),
          isActive,
          options: poll.options.map(option => ({
            text: option.text,
            votes: option.votes
          }))
        };
      });
    //   console.log(formattedPolls , "formattedPOlls")
  
    return  res.status(200).json({formattedPolls});
    } catch (error) {
      console.error("Error fetching polls:", error);
      next(error)
    }
  };

  export const updatePolls = async (req, res, next) => {
    try {
        const { pollId, pollDetails } = req.body;
        
        
        await updatePoll(pollId, pollDetails);
        console.log("Poll updated successfully");

        return await getPolls(req, res, next);

    } catch (error) {
        console.error("Error updating poll:", error);
        next(error);
    }
};
