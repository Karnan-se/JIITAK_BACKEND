import { HttpStatus } from "../enums/StatusCodes.js";

 const AutherizeRole = (allowedUsers) => {
  return (req, res, next) => {
    console.log(allowedUsers , req.user.role , ":"  ,"role")
    
    if (!req.user || !allowedUsers.includes(req.user.role)){
      return res
        .status(HttpStatus.FORBIDDEN)
        .json({ err: `AUtherization Denied for ${allowedUsers[0]} `, user:allowedUsers });
    }
    console.log(req.user.role, "Autherised User");
    next();
  };
};

export const admin_Autherisation = AutherizeRole(["Admin"]);
export const user_Autherisation = AutherizeRole(["User"]);
export const public_Autherisation = AutherizeRole(["User", "Admin"]);
