import mongoose , {Schema} from "mongoose";
import bcrypt from "bcrypt";  
import jwt from "jsonwebtoken";

const userSchema = new Schema(
{
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    fullName: {
        type: String,
        required: true,
        trim: true,
        index: true,
    },
    avatar: {
        type: String, //cloudinary url
        required: true,
    },
    coverImage: {
        type: String //cloudinary url
    },
    watchHistory: {
        type: Schema.Types.ObjectId,
        ref:"Video",
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    refreshToken:{
        type : String,
    }    
},
{
    timestamps: true,
  }
)

userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return ;
    this.password = await bcrypt.hash(this.password, 10);
})
//i have removed the next parameter from the pre save hook as we are using async handler to catch errors. if there is an error in hashing password, it will be caught by async handler and sent to error handling middleware. we don't need to call next with error here. if there is an error, it will be thrown and caught by async handler. if there is no error, the function will complete successfully and mongoose will save the user document.

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            username: this.username,
            email: this.email,
            fullName: this.fullName,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    )
}

userSchema.methods.generateRefreshToken= function (){
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        }
    )
}


export const User= mongoose.model("User",userSchema)