import express from "express"
import { adminLogin, createPoll  , getPolls , updatePolls, adminRegister ,logout  } from "../controller/adminController.js";
import { getUserData } from "../controller/japaneeseUserController.js";
import jwtAuth from "../middleware/authMiddleware.js";



const adminrouter = express.Router();



adminrouter.post("/createPoll",createPoll )
adminrouter.get("/getPolls", jwtAuth , getPolls )
adminrouter.post("/updatePolls",updatePolls )
adminrouter.post("/login", adminLogin )
adminrouter.post("/register", adminRegister  )
adminrouter.patch("/logout",logout )

adminrouter.get("/getUserData",jwtAuth , getUserData)
export {adminrouter}