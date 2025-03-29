import mongoose from "mongoose";
const { Schema } = mongoose;

const japaneseUserSchema = new Schema({
    nickname: { type: String, maxlength: 12 },
    email: { type: String, required: true, unique: true },
    birthDate: { type: String }, 
    gender: { type: String },
    location: { type: String },
    registrationDate: { type: String },
    password:{type:String},
}, { timestamps: true });

export const JapaneseUserModal = mongoose.model("japaneseUser", japaneseUserSchema);
