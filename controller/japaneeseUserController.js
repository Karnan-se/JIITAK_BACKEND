import AppError from "../utils/appError.js";
import { generateAccessToken, generateRefreshToken } from "../services/jwtService.js";
import { JapaneseUserModal } from "../model/japaneeseUserModal.js";
import { attachTokenCookie } from "../services/attachCookie.js";
import { comparePassword } from "../utils/passwordService.js";
import { sendPasswordResetEmail } from "../services/EmailService.js";
import crypto from  "crypto"
import { PasswordResetToken } from "../model/PasswordResetModal.js";
import { ConfigKeys } from "../config.js";
import { sendEmail } from "../services/EmailService.js";
import { hashPassword } from "../utils/passwordService.js";


export const jRegister = async (req, res, next) => {
    try {
      
      const { nickname, email, birthDate, gender, location, registrationDate, password } = req.body;
      console.log("reached correctly")
  
      if (!email) {
        throw AppError.conflict("Missing Email Address");
      }
      if (!password) {
        throw AppError.conflict("Missing Password");
      }
  
      const existingUser = await JapaneseUserModal.findOne({ email });
      if (existingUser) {
        throw AppError.validation("Email Already Registered");
      }
  
      const hashedPassword = await hashPassword(password);
  
      const newUser = await JapaneseUserModal.create({
        nickname,
        email,
        birthDate,
        gender,
        location,
        registrationDate,
        password: hashedPassword,
      });
  
      if (newUser) {
        const accessToken = generateAccessToken(newUser._id);
        const refreshToken = generateRefreshToken(newUser._id);
  
        attachTokenCookie("AccessToken", accessToken, res);
        attachTokenCookie("RefreshToken", refreshToken, res);
      }
      console.log(newUser , "userCreated successfully")
  
      return res.status(201).json({newUser});
    } catch (error) {
      console.log(error);
      next(error);
    }
  };



  export const jLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email) {
            throw AppError.conflict("メールアドレスがありません", "No Email Received");
        }
        if (!password) {
            throw AppError.conflict("パスワードがありません", "No Password Received");
        }

        const userDetails = await JapaneseUserModal.findOne({ email });

        if (!userDetails) {
            throw AppError.validation("ユーザーが登録されていません", "User not registered");
        }

        if (!userDetails.password) {
            throw AppError.conflict( "Password not found for user");
        }

        const comparedPassword = await comparePassword(password, userDetails.password);

        if (!comparedPassword) {
            throw AppError.validation("パスワードが間違っています", "Incorrect Password");
        }

        const accessToken = generateAccessToken(userDetails._id);
        if (!accessToken) {
            throw AppError.conflict("アクセストークンの作成エラー", "Error creating Access Token");
        }

        const refreshToken = generateRefreshToken(userDetails._id);
        if (!refreshToken) {
            throw AppError.conflict("リフレッシュトークンの作成エラー", "Error creating Refresh Token");
        }

        attachTokenCookie("AccessToken", accessToken, res);
        attachTokenCookie("RefreshToken", refreshToken, res);

        return res.status(200).json({ userDetails });

    } catch (error) {
        console.log(error);
        next(error);
    }
};


export const SendResetPaswwordLink = async(req, res, next)=>{
  try {
    const {email}  = req.body;
    console.log(email)

    const user = await JapaneseUserModal.findOne({email})
    if(!user){
      return res.status(200).json({message:"user Not fouund"})
    }
    const token = crypto.randomBytes(32).toString("hex");

    await PasswordResetToken.deleteMany({ userId: user._id });

    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); 
    
    await PasswordResetToken.create({
      userId: user._id,
      token,
      expiresAt,
    });

    console.log(ConfigKeys.CLIENT_ORGIN)
    const resetLink = `${ConfigKeys.CLIENT_ORGIN}/reset-password?token=${token}&id=${user._id}`;
    console.log(`Reset Link: ${resetLink}`); //
    await sendEmail(user.email, "Reset Password", `
      <h2>Password Reset Request</h2>
      <p>Click the link below to reset your password. This link is valid for 24 hours:</p>
      <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
      <p>If you did not request this, please ignore this email.</p>
    `);

    return res.status(200).json({ message: "Reset link sent to email" });
    
  } catch (error) {
    console.log(error)
    
  }
}


export const ResetPassword = async (req, res) => {
  try {
    const { token, id, newPassword } = req.body;

    console.log(token , id, newPassword ,  "dagta reccieved")

  
    const resetToken = await PasswordResetToken.findOne({ userId: id, token });

    if (!resetToken || resetToken.expiresAt < new Date()) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const hashedPassword = await hashPassword(newPassword);

   
    await JapaneseUserModal.findByIdAndUpdate(id, { password: hashedPassword });

  
    await PasswordResetToken.deleteMany({ userId: id });

    return res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Error resetting password:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


export const getUserData = async(req, res, next)=>{
 try {
  const  userData = await JapaneseUserModal.find()
  console.log(userData , "userData")
  return res.status(200).json({userData})
  
 } catch (error) {
  console.log(error)
  
 }

}