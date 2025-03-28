import express from "express"
import { createPoll  , getPolls , updatePolls } from "../controller/adminController.js";


const adminrouter = express.Router();


// adminrouter.post("/Login", )

adminrouter.post("/createPoll",createPoll )
adminrouter.get("/getPolls", getPolls )
adminrouter.post("/updatePolls",updatePolls )



export {adminrouter}