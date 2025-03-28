import mongoose  from "mongoose";
import { Schema } from "mongoose";

const userSchema =  new Schema({
    name:{type: String, required :false },
    emailAddress: {type: String, required:true , unique: true },
    password :{type:String, required:true}
},{timestamps:true})

export  const UserModal = mongoose.model("user", userSchema)
