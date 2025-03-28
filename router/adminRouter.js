import express from "express"
import { createPoll } from "../controller/adminController.js";

const adminrouter = express.Router();


// adminrouter.post("/Login", )

adminrouter.post("/createPoll",createPoll )



export {adminrouter}