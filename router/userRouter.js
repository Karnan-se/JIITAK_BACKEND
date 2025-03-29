import express from  "express"
import { userLogin , userRegister , updateVotes , logout ,  } from "../controller/userController.js"


const userRouter = express.Router()


userRouter.post("/login" , userLogin)
userRouter.post("/register", userRegister)
userRouter.post("/updatevote", updateVotes )
userRouter.post("/logout", logout)

export {userRouter}