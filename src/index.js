// require("dotenv").config({path:"./env"})
import dotenv from "dotenv"
import mongoose from "mongoose";    
import {DB_NAME} from "../src/constants.js"
import connectDB from "./db/index.js"
import {app} from "./app.js"

dotenv.config({
    path:"./env"
})

connectDB()

.then(()=>{
    app.on("errror", (error) => {
            console.log("ERRR: ", error);
            throw error
        })
        
    app.listen(process.env.PORT || 8000, () =>{
        console.log(`App is listening on port ${process.env.PORT || 8000}`);
    })
})
.catch((err)=>{
    console.error("MONGODB CONNECTION failed", err);
})




/*
this is the basic approach. We will connect to the database here and start the server.


import mongoose from "mongoose"
import {DB_NAME} from "./constants.js"

import express from "express"
const app = express()
( async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("errror", (error) => {
            console.log("ERRR: ", error);
            throw error
        })

        app.listen(process.env.PORT, () => {
            console.log(`App is listening on port ${process.env.PORT}`);
        })

    } catch (error) {
        console.error("ERROR: ", error)
        throw err
    }
})()

*/