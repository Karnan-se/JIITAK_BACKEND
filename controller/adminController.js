import Poll from "../model/pollModal.js"
import AppError from "../utils/appError.js"
import { savePoll } from "../repository/pollRepository.js"


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