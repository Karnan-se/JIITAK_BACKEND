import mongoose from "mongoose";
import { ConfigKeys } from "../config.js";



export default async function connectDataBase(){
try {
    const dataBase =  await  mongoose.connect(ConfigKeys.mongoURL)
    console.log("dataBase connected")
    
} catch (error) {
    console.log(error)
    throw error
    
}

}
