import { Router } from "express";
import { userRegister } from "../controllers/user.controller.js";
import {upload} from "../middleware/multer.middleware.js";

const router = Router();

router.route("/register").post(
upload.fields([
    {
     name: "avatar",
     maxCount: 1
    },
    {
    name: "images",
    maxCount: 5
}
    ])
    ,userRegister);

export default router;