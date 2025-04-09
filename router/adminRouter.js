import express from "express"
import { adminLogin, createPoll  , getPolls , updatePolls, adminRegister ,logout  } from "../controller/adminController.js";
import { getUserData } from "../controller/japaneeseUserController.js";
import jwtAuth from "../middleware/authMiddleware.js";
import { public_Autherisation , admin_Autherisation } from "../middleware/AutherizationMiddleware.js";



const adminrouter = express.Router();



adminrouter.post("/createPoll", jwtAuth ,admin_Autherisation ,   createPoll )
adminrouter.get("/getPolls", jwtAuth, public_Autherisation , getPolls )
adminrouter.post("/updatePolls",jwtAuth , public_Autherisation , updatePolls )
adminrouter.post("/login", adminLogin )
adminrouter.post("/register", adminRegister  )
adminrouter.patch("/logout",logout )

adminrouter.get("/getUserData",jwtAuth , getUserData)
export {adminrouter}