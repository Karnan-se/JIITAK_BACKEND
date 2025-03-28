import express from  "express"
import cookieParser from "cookie-parser";
import connectDataBase from "./Services/ConnectDb.js";
import { ConfigKeys } from "./config.js";
import cors from "cors"
import { adminrouter } from "./router/adminRouter.js";
import { userRouter } from "./router/userRouter.js";
import errorHandler from "./middleware/errorHandler.js";
const app = express()


app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended:true}))



app.use(cors({
     origin:ConfigKeys.CLIENT_ORGIN,
     credentials:true,
     
}))


connectDataBase()

app.use("/admin" , adminrouter)
app.use("/" ,userRouter)


app.use(errorHandler)





app.listen(ConfigKeys.PORTNUMBER , ()=>{
    console.log("server created" , ConfigKeys.PORTNUMBER)
    
})