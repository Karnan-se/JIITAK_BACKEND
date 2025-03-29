import AppError from "../utils/appError.js";
import { generateAccessToken, generateRefreshToken, } from "../services/jwtService.js";
import { comparePassword  , hashPassword} from "../utils/passwordService.js";
import { UserModal } from "../model/userModal.js";
import { attachTokenCookie } from "../services/attachCookie.js";
import { updateVote } from "../repository/pollRepository.js";
import { ConfigKeys } from "../config.js";
import Vote from "../model/VoteModal.js";





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


export const adminRegister = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    if (!email) {
      throw AppError.conflict("Missing Email Address");
    }
    if (!password) {
      throw AppError.conflict("Missing Password");
    }
    if (!name) {
      throw AppError.conflict("Missing Name");
    }

  
    const existingAdmin = await AdminModal.findOne({ emailAddress: email });
    if (existingAdmin) {
      throw AppError.validation("Email Already Registered as Admin");
    }

    
    const hashedPassword = await hashPassword(password);

    
    const newAdmin = await AdminModal.create({
      emailAddress: email,
      password: hashedPassword,
      name: name,
      role: "admin", 
    });

    if (newAdmin) {
      
      const accessToken = generateAccessToken(newAdmin._id);
      const refreshToken = generateRefreshToken(newAdmin._id);

      
      attachTokenCookie("AccessToken", accessToken, res);
      attachTokenCookie("RefreshToken", refreshToken, res);
    }

    
    return res.status(201).json({
      message: "Admin registration successful",
      adminDetails: {
        id: newAdmin._id,
        email: newAdmin.emailAddress,
      },
    });

  } catch (error) {
    console.log(error);
    next(error);
  }
};



export const updateVotes = async(req, res, next)=>{
  try {
    const {userInfo ,pollId , pollDetails} = req.body
  
    const updatedVotes = await updateVote(pollId , pollDetails)
    console.log(updatedVotes)
    res.status(200).json({updatedVotes})

    const voteCreated = await Vote.create({userId : userInfo , pollId:pollId})
    console.log(voteCreated , "voteCreated")


  } catch (error) {
    console.log(error)
    next(error)
    
  }
}


export const logout = async (req, res, next) => {
  try {
    // Clear the access and refresh tokens from cookies
     res.clearCookie("AccessToken", { httpOnly: true, secure: ConfigKeys.NODE_ENV == "production" ? true : false });
       res.clearCookie("RefreshToken", { httpOnly: true, secure: ConfigKeys.NODE_ENV == "production" ? true : false });
       console.log("cookies cleaed on the basis production and development")
    console.log("cookies cleared")

    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    next(error);
  }
};