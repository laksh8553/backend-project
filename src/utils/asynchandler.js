const asynHandler=(requestHandler)=>(req,res,next)=>{
    Promise.resolve(requestHandler(req, res, next)).catch((error)=> next(error))
}

export{asynHandler}


//another method to invoke the async handler is to use try catch block. But this method is more concise and cleaner. We can use it like this:
// const asyncHandler = (fn) => async (req, res, next) => {
//     try {
//         await fn(req, res, next)
//     } catch (error) {
//         res.status(err.code || 500).json({
//             success: false,
//             message: err.message
//         })
//     }
// }