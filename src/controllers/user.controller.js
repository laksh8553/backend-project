import {asyncHandler} from '../utils/asynchandler.js';
import {ApiError} from '../utils/apierror.js';
import {User} from '../models/user.models.js';
import {uploadOnCloudinary} from '../utils/cloudinary.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const userRegister = asyncHandler(async (req, res) => {
    
     // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res

    const {fullName,username,email,password} = req.body
    console.log("email",email);

    if([fullName, username, email, password].some((field) => field?.trim() === "")){
    throw new ApiError(400,"All fields are required")
    }

    const existedUser = User.findOne({
        $or:[
            {username},
            {email}
        ]
    })
    
    if(existedUser){
        throw new ApiError(400,"User already exists with email or username")
    }

    const avtarLocalPath = req.files?.avatar?.[0]?.path;
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

    if(!avtarLocalPath){
        throw new ApiError(400,"Avatar file is required")
    }

    const avatar= await uploadOnCloudinary(avtarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new ApiError(500,"Failed to upload avatar image")
    }

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        username: username.toLowerCase(),
        email,
        password
    })

    const createdUser = await User.findById(user._id).select("-password -refreshToken") //excludes password and refresh token from response using select method of mongoose. we can also use delete operator to remove these fields from the user object before sending response. but this method is more efficient as it does not fetch these fields from database at all.
    
    if(!createdUser){
        throw new ApiError(500,"Failed to create user")
    }

    return res.status(201).json(
        new ApiResponse(201, createdUser, "User registered successfully")
    )

})


// we can also do individual field validation like this:
// if(!fullName){
//     throw new ApiError("Full name is required", 400)
// }

export {userRegister}