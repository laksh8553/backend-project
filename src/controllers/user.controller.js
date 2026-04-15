import {asyncHandler} from '../utils/asynchandler.js';

const userRegister = asyncHandler(async (req, res) => {
    res.status(200).json({
        message: "User registered successfully",
    })
})

export {userRegister}