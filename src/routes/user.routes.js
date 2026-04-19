import { Router } from "express";
import {loginUser, logoutUser, userRegister } from "../controllers/user.controller.js";
import {upload} from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/register").post(
upload.fields([
    {
     name: "avatar",
     maxCount: 1
    },
    {
    name: "coverImage",
    maxCount: 1
    }
    ])
    ,userRegister);

router.route("/login").post(loginUser)

//secured routes for user profile update, password change, etc. can be added here. we will add them later when we have authentication and authorization in place.

router.route("/logout").post(verifyJWT,logoutUser)



export default router;