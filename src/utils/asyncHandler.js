// const asyncHandler = (fn) => {async()=>{}}
// const asyncHandler = (fn) => async()=>{} //Higher order fun bnate time {} hta dia bs

// const asyncHandler = (fn) => async(req, res, next) => {
//     try {
//         await fn(req, res, next)
//     } catch (error) {
//         res.status(err.code || 500).json({
//             success: false,
//             message: err.message
//         })
//     }
// }

// Same code with help of promises
const asyncHandler = (requestHandler) => {
    return (req, res, next) =>{
        Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err))
    }
}

export { asyncHandler }