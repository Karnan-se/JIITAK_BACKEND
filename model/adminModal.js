import mongoose, { Schema } from "mongoose";

const adminSchema = new Schema(
  {
    name: { type: String, required: false },
    emailAddress: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);


export const AdminModal =  mongoose.model("admin", adminSchema)