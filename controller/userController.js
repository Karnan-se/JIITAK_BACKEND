import AppError from "../utils/appError.js";
import { generateAccessToken, generateRefreshToken, } from "../services/jwtService.js";
import { comparePassword  , hashPassword} from "../utils/passwordService.js";
import { UserModal } from "../model/userModal.js";
import { attachTokenCookie } from "../services/attachCookie.js";





export const userLogin = async (req, res, next) => {
    try {
  
      const { email, password } = req.body;
      if (!email) {
        throw AppError.conflict("Missing Emailaddress");
      }
      if (!password) {
        throw AppError.conflict("Missing Password");
      }
      const userDetails = await UserModal.findOne({ emailAddress: email });
      if (!userDetails) {
        throw AppError.validation("User Not Registered");
      }
      const comparedPassword = await comparePassword(
        password,
        userDetails.password
      );
      if (!comparedPassword) {
        throw AppError.validation("Incorrect Password");
      }
      const accessToken = generateAccessToken(userDetails._id)
      if(!accessToken){
        throw AppError.conflict("Error creating accessToken")
      }
      console.log(accessToken , "AccessToken" , "\n" , "\n")
      const refreshToken  = generateRefreshToken(userDetails._id)
      if(!refreshToken){
        throw AppError.conflict("Error creating the refreshToken")
      }
      console.log(refreshToken  ,  "refreshToken")
      attachTokenCookie("AccessToken", accessToken, res)
      attachTokenCookie("RefreshToken", refreshToken, res)
    
      return res.status(200).json({ userDetails });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
  

  
export const userRegister = async (req, res, next) => {
  try {
    const { email, password , name } = req.body;

    if (!email) {
      throw AppError.conflict("Missing Email Address");
    }
    if (!password) {
      throw AppError.conflict("Missing Password");
    }
    if(!name){
      throw AppError.conflict("Missing Name")
    }


    const existingUser = await UserModal.findOne({ emailAddress: email });
    if (existingUser) {
      throw AppError.validation("Email Already Registered");
    }


    const hashedPassword = await hashPassword(password);

 
    const newUser = await UserModal.create({
      emailAddress: email,
      password: hashedPassword,
      name : name
    });

    if(newUser){
      const accessToken = generateAccessToken(newUser._id)
      const refreshToken  = generateRefreshToken(newUser._id)
      attachTokenCookie("AccessToken", accessToken, res)
      attachTokenCookie("RefreshToken", refreshToken, res)
    }

    return res.status(201).json({
      message: "Registration successful",
      userDetails: {
        id: newUser._id,
        email: newUser.emailAddress,
      },
    });

  } catch (error) {
    console.log(error);
    next(error);
  }
};