import { ConfigKeys } from "../config.js";



const attachTokenCookie = (cookieName, Token, res) => {
    const cookieOption = {
        httpOnly: true,
        secure: ConfigKeys.NODE_ENV === "production",
        signed: false,
        maxAge: cookieName === "AccessToken" ? 15 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000,
       sameSite: ConfigKeys.NODE_ENV === "production" ? "None" : "Lax"
    };

    try {
        res.cookie(cookieName, Token, cookieOption);
        console.log("Cookie Attached");
    } catch (error) {
        console.error(error);
    }
};

export { attachTokenCookie };
