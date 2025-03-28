import mongoose  from "mongoose";
import Poll from "../model/pollModal.js";
import AppError from "../utils/appError.js";


export const savePoll  = async(pollDetails)=>{
    try {
        const  createPoll =await  Poll.create(pollDetails)
        console.log(createPoll , "Poll Created")
        return createPoll
        
    } catch (error) {
        console.log(error)
        throw AppError.conflict("error creating a poll")
    }
}