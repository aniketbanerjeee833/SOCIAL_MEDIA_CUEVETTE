

const User=require("../models/userSchema")
const ErrorHandler = require("../utils/utilities")
const jwt=require("jsonwebtoken")

// const isAuthenticated=async(req,res,next)=>
// {
//     try{
//         const token = req.cookies["token"]
//         console.log(token)
//         // if(token){
//         //     console.log("token found")
//         // }
//         if(!token){
//             return res.status(401).json({
//                 message:'Please login to access the route',
//                 success:false
//             });
//         }
//         // // const token=req.cookies["token"]
//          //if(!token) return next(new ErrorHandler("Please login to access this route",401))
//          const decoded =  jwt.verify(token, process.env.JWT_SECRET_KEY);
    
//         console.log(decoded)
//         if(!decoded){
//             return res.status(401).json({
//                 message:'Invalid',
//                 success:false
//             });
//         }
//         req.user = await User.findById(decoded.id);
//         next();
//     }catch(error)
//     {
//         console.log(error)
//         next(error)
      
       
//     }
   
// }

const isAuthenticated=async(req,res,next)=>
{
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer')) {
      return res.status(401).json({
        message:'Authentication Invalid',
        success:false
    });
    }

    const token = authHeader.split(' ')[1]
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
      // attach the user to the job routes
      // console.log(decoded)
      if(!decoded){
          return res.status(401).json({
              message:'Invalid',
              success:false
          });
      }
      req.user = await User.findById(decoded.id);
      // console.log(req.user,"req.user")
      next()
    } catch (error) {
    console.log(error)
    }
  
}

module.exports=isAuthenticated