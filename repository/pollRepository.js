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

export const getPoll = async()=>{

    try {
        const poll = await Poll.find()
        console.log(poll)
        return poll
        
    } catch (error) {
        throw AppError.conflict("no Poll")
        
    }
}

export const updatePoll =async(pollId , pollDetails)=>{
    try {

        const existingPoll = await Poll.findById(pollId);
        if (!existingPoll) throw new Error("Poll not found");

        const updatedOptions = pollDetails.options.map((newText) => {
            const existingOption = existingPoll.options.find(opt => opt.text === newText);
            return {
                text: newText,
                votes: existingOption ? existingOption.votes : 0, 
            };
        });

        
        const updatedData = {
            
            title: pollDetails.title,
            description: pollDetails.description,
            duration: Number(pollDetails.duration),
            isPrivate: pollDetails.isPrivate,
            allowedUsers: pollDetails.isPrivate ? pollDetails.allowedUsers : [], 
            options: updatedOptions, 
        };
        const pollUpdated = await Poll.findByIdAndUpdate(
            pollId,
            { $set: updatedData },
            { new: true }
        );

        console.log(pollUpdated , "pollupdated");
        return pollUpdated;

        
    } catch (error) {
        console.log(error)
        throw error
        
    }
} 
