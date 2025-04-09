import dotenv from "dotenv";
dotenv.config();

export const ConfigKeys = {
  mongoURL: process.env.MONGOURL,
  PORTNUMBER: process.env.PORT_NUMBER,
  CLIENT_ORGIN: process.env.NODE_ENV == "development" ? "http://localhost:5173" : "https://jiitak-japaneese-i3p4hsibs-karnan-ses-projects.vercel.app",
  ACCESS_TOKEN_EXPIRES_IN: "15m",
  REFRESH_TOKEN_EXPIRES_IN: "7d",
  JWTSECRET :process.env.JWTSECRET,
  NODE_ENV : process.env.NODE_ENV,
  Email: "karnan.karnan.s@gmail.com",
  Mail_password : "gezy atrx vxuh amaa",
};

