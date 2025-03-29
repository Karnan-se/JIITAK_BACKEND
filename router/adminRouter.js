import express from "express"
import { adminLogin, createPoll  , getPolls , updatePolls, adminRegister } from "../controller/adminController.js";


const adminrouter = express.Router();



adminrouter.post("/createPoll",createPoll )
adminrouter.get("/getPolls", getPolls )
adminrouter.post("/updatePolls",updatePolls )
adminrouter.post("/login", adminLogin )
adminrouter.post("/register", adminRegister  )


export {adminrouter}