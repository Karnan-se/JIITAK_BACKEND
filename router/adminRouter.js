import express from "express"
import { adminLogin, createPoll  , getPolls , updatePolls, adminRegister ,logout  } from "../controller/adminController.js";
import { getUserData } from "../controller/japaneeseUserController.js";



const adminrouter = express.Router();



adminrouter.post("/createPoll",createPoll )
adminrouter.get("/getPolls", getPolls )
adminrouter.post("/updatePolls",updatePolls )
adminrouter.post("/login", adminLogin )
adminrouter.post("/register", adminRegister  )
adminrouter.patch("/logout",logout )

adminrouter.get("/getUserData" , getUserData)
export {adminrouter}