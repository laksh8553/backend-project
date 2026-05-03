import { asyncHandler } from "../utils/asynchandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js"
import { ApiError } from "../utils/ApiError.js";


export const verifyJWT= asyncHandler(async(req,_,next)=>{
    //get the token from header
    //verify the token
    //if valid, attach the user to req object and call next
    //if invalid, throw an error
    try{
    const token = req.cookies?.accessToken || req.headers("Authorization")?.replace("Bearer ", "")
    //we replaced the "Bearer " part from the token as the token is sent in the format "Bearer <token>". we only need the token part for verification, so we remove the "Bearer " part from the token string.

    if(!token){
        throw new ApiError(401,"Unauthorized request")
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user= await User.findById(decodedToken._id).select("-password -refreshToken")

    if (!user) {
        throw new ApiError(401, "Invalid access token")
    }

    req.user = user;
    next()
}catch(error){
    throw new ApiError(401, error?.message || "Unauthorized request") 
}

    

})