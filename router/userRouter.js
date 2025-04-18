import express from  "express"
import { userLogin , userRegister , updateVotes , logout ,  } from "../controller/userController.js"
import { jLogin, jRegister } from "../controller/japaneeseUserController.js"
import { sendPasswordResetEmail } from "../services/EmailService.js"
import { SendResetPaswwordLink } from "../controller/japaneeseUserController.js"
import { ResetPassword } from "../controller/japaneeseUserController.js"
import { votedUser } from "../controller/pollController.js"
import jwtAuth from "../middleware/authMiddleware.js"
import { public_Autherisation, user_Autherisation } from "../middleware/AutherizationMiddleware.js"




const userRouter = express.Router()


userRouter.post("/login" , userLogin)
userRouter.post("/register", userRegister)
userRouter.post("/updatevote",jwtAuth, public_Autherisation ,  updateVotes )
userRouter.post("/logout", logout)
userRouter.get("/fetchVote", votedUser)


userRouter.post("/jregister",jRegister )
userRouter.post("/jlogin", jLogin )

userRouter.post("/passswordreset", SendResetPaswwordLink )
userRouter.post("/verify" ,ResetPassword)

export {userRouter}