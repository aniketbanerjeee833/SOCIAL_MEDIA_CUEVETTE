
const User = require("../models/userSchema")
const { generateToken } = require("../utils/jwtToken")
const Story=require("../models/storySchema")
const ErrorHandler=require("../utils/utilities")
const jwt=require("jsonwebtoken")
const register = async (req, res, next) => {
    try {
        const { userName, password } = req.body
        if (!userName || !password ){
            return res.status(400).json({
                message: "All fields required",
                success: false,
            }); 
        }
     
        
        const userExists = await User.findOne({userName })
        if (userExists) {
            return res.status(400).json({
                message: `${userName} already exists ,please login to continue`,
                success: false,
            });  
        }
        

        const user = await User.create({
            userName,  password, 
        })
       
        const token = userExists.createJwt()
        //generateToken(user, "Login Successfully!", 200, res);
        return res.status(200).json({
            success: true,
            message:"register successfull",
            user,token
          }) 
      
    } catch (error) {
        console.log(error)
        next(error)
    }
}

const login = async (req, res, next) => {
    try {
        const { userName, password } = req.body

        if (!userName || !password)  {
            return res.status(400).json({
                message: "All fields required",
                success: false,
            }); 
        }

        const user = await User.findOne({ userName })
        
       

        if (!user)     {
            return res.status(401).json({
                message: "Enter a valid username",
                success: false,
            });
        }

        const isPasswordMatched = await user.comparePassword(password)
        if (!isPasswordMatched) {
            return res.status(401).json({
                message: "Incorrect password,password not match or may be need to register first",
                success: false,
            });
        }

       
        if (user&&!isPasswordMatched)     {
            return res.status(401).json({
                message: "Incorrect password,password not match",
                success: false,
            });
        }

        const token = user.createJwt()
        //generateToken(user, "Login Successfully!", 200, res);
        return res.status(200).json({
            success: true,
            message:"login successfull",
            user,token
          }) 
        // res.status(StatusCodes.OK).json({ user: { name: user.name }, token })


    }
    catch (error) {
        console.log(error)
        next(error)

    }

}
const logout = async (req, res, next) => {
    try {
        return res.status(200).json({
           
            success: true,
            message: "Logged Out!",
            token:"",   

        });
    } catch (error) {
        console.log(error)
        next(error)
    }
}
const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id)
        if(!user) return next(new ErrorHandler("user not logged in",400))
        return res.status(200).json({
            success: true,
            user
        })

    } catch (error) {
        console.log(error)
        next(error)
    }
}

const getAllStories=async(req,res,next)=>
    {
        try{
            const stories=await Story.find()
            return res.status(200).json({
                success: true,
                stories
              })   
        }catch(error){
        console.log(error)
            next(error) 
    }
    }
    

    const viewBookmarkStory=async(req,res,next)=>{
        try{
            const userId=req.user._id;
           //const storyId=req.body;
            const user = await User.findById(userId)
            if(!user) return next(new ErrorHandler("user not logged in",400))

        //    let allStories=await Story.find({bookmarks:{$eq:userId}}).select("-bookmarks")
        const userBookmarks1 = user.bookmarks.map(book => book.trim());
        let allStories=await Story.find({})
        const slidesInStory=allStories.map((curStory)=>curStory.slidesInStory.flat())
        ///console.log(slidesInStory)
    //     console.log(user.bookmarks,user.bookmarks.length)
     ///console.log(allStories)
     let bookmarkSlides1=[]
    let bookmarkSlides3=[]

            // for(let i=0; i<user.bookmarks.length;i++){
            
                
             for(let i=0; i<userBookmarks1.length;i++){
                 
            bookmarkSlides1=slidesInStory.flat().filter((curSlide)=>curSlide._id == userBookmarks1[i])
            // console.log(bookmarkSlides1,userBookmarks1[i])
            
             bookmarkSlides3.push(bookmarkSlides1)
                // console.log(bookmarkSlides3)
        
            } 
            // console.log(bookmarkSlides3.flat())
            let bookmarkSlides4=bookmarkSlides3.flat()


    //                  bookmarkSlides1=allStories.map((curStory)=>curStory.slidesInStory.
    //          filter((curSlide)=> 
    //             {
                   
    //                     return curSlide._id == userBookmarks1[2]
                    
                 
    //     })
    
    // )

      
    //   const matchingDocuments=findMatchingDocuments(allStories, userBookmarks1)
        // console.log(bookmarkSlides1)
            // const bookmarkSlides1=await Story.find({"slidesInStory._id":{$in:userBookmarks1}})
      
        //     bookmarkSlides3.push(bookmarkSlides1)
            
        //   let bookmarkSlides2=bookmarkSlides3.flat()
          //console.log(userBookmarks1)
            //  let bookmarkSlides4=await Story.find({"slidesInStory._id":{$in:bookmarkSlides2.slidesInStory._id}})
            //  let bookmarkSlides5=bookmarkSlides4.flat()
            return res.status(200).json({
                success: true,
             bookmarkSlides4,
            // slidesInStory
              })
           
    }
           

        //console.log(bookmarkSlides1)
    //   let bookmarkSlides2=bookmarkSlides3.flat()
    //   console.log(bookmarkSlides2.length)
    //   console.log(bookmarkSlides2)
     //let bookmarkSlides=await Story.find({slidesInStory:{_id:{$in:user.bookmarks}}})
    //let bookmarkSlides=await Story.find({"slidesInStory._id":user.bookmarks})
   
     //let bookmarkSlides=await Story.find({"slidesInStory._id":{$all:user.bookmarks}})
     //let bookmarkSlides=await Story.find({"slidesInStory._id":{$eq:user.bookmarks}})
        //console.log(bookmarkSlides2)
         //console.log(bookmarkSlides2)
        //  console.log(bookmarkSlides.length)
            // const bookmarkStories=allStories.map((i)=>i.bookmarks.filter((id)=>id===userId))
            
        catch(error){
            console.log(error)
            next(error)
        }
    }

    const getLikesCount=async(req,res,next)=>
    {
        try{

        
       
        
        //const allUser=await User.find()
        const singleStoryId=req.params.singleStoryId
        
        //const{slideId}=req.body
        const slideId=req.params.slideId
        const storyExists=await Story.findById(singleStoryId)
        //let likedSlides1=[]
        // for(let i=0; i<allUser[0].likes.length; i++){
        //     //  let bookmarkSlides={}
        //          let likedSlides=storyExists.slidesInStory.filter((curSlide)=>curSlide._id.toString() == allUser[0].likes[i].toString())
        //          likedSlides1.push(likedSlides)
        //         console.log(likedSlides)
        //     }
        //let likedSlidesCount=await Story.find({"singleStoryId.slidesInStory":{slideId}})
        let likedSlides=storyExists.slidesInStory.filter((curSlide)=>curSlide.id==slideId)
        //console.log(likedSlides)
        let likedSlidesCount=likedSlides[0]?.likesCount
        //console.log(likedSlidesCount)
        //let likedSlides=storyExists.slidesInStory.filter((curSlide)=>curSlide._id.toString() == allUser[0].likes[i].toString())
        // for(let i=0;i<allUser[0].likes.length;i++){
        //     likedSlides1.push(allUser[0].likes=slideId)
        //     console.log(likedSlides1)
        // }
            //let likedSlides2=likedSlides1.length()

            return res.status(200).json({
                success: true,likedSlides,
            likedSlidesCount
              }) 
            }catch(error){
            console.log(error)
            next(error)
        }
    }

module.exports={register,login,getUser,logout,getAllStories,getLikesCount,viewBookmarkStory}