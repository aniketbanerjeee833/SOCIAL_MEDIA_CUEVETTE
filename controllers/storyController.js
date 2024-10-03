const ErrorHandler = require("../utils/utilities")
const Story=require("../models/storySchema")
const User=require("../models/userSchema")
const http = require('http');
const fs = require('fs');
const path = require('path');
const axios =require ("axios")




const createStory = async (req, res, next) => {
    try {
      //const creator=req.user._id
      const userId=req.user._id
      //const {quizName,quizType,questions} =req.body
      const{slidesInStory,category}=req.body
     
        if(!category)  {
            return res.status(200).json({
           
                success: false,
                message: "plz provide category to procedd",
                
    
            })
        }
          
  
      if(!slidesInStory) {
        return res.status(200).json({
       
            success: false,
            message: "story should have slides",
            

        })
    }
   
        if(slidesInStory.length>6) {
            return res.status(200).json({
           
                success: false,
                message: "maximum slides in a story can be 6",
                
    
            })
        }

      const story=new Story({
        slidesInStory,
        category,
        userId
  
  })

  await story.save()

      return res.status(200).json({
        success: true,
        message: "Story created successfully",
        story
      })
  
  
    } catch (error) {
  
      console.log(error)
      next(error)
    }
  }
 
  const getAllMyStories=async(req,res,next)=>
    {
    try{
    const userId=req.user._id
    const stories=await Story.find({userId:userId})
    return res.status(200).json({
        success: true,
        stories
      })
    }catch(error){
        console.log(error)
            next(error) 
    }
    }
  
  
   const likeOrDislikeStory = async (req,res,next) => {
        try {
            const userId=req.user._id;
            const singleStoryId=req.params.id
            const user=await User.findById(userId)
            if(!user) {
                return res.status(401).json({
                    message: "plz login to like",
                    success: false,
                });
            }
            const{slideId}=req.body
            const storyExists=await Story.findById(singleStoryId)
            //const storyExists=await Story.find({slidesInStory:singleSlideId})  
            
           console.log(storyExists)
            if(!user)  {
                return res.status(401).json({
                    message: "user not  exists",
                    success: false,
                });
               
            }
                
            if(!storyExists) {
                return res.status(401).json({
                    message: "story not exists",
                    success: false,
                });
            }
       
                // ///const curSlides=await Story.find({"slidesInStory._id":slideId})
               
            // if(!storyExists.likes.includes(userId)){
              //console.log(curSlides)
            //     //const story=await Story.findByIdAndUpdate(singleStoryId,{$addToSet:{likes:userId}},{new:true,runValidators:true});
            //      //await storyExists.updateOne({$push:{likes:userId}});
            // if(curSlides[0].likes.includes(userId)){
                // await storyExists.updateOne({slidesInStory:{$inc:{likes:1}}});
                //curSlides[0].likes.likesCount-=1
                // curSlides.likes?.push(userId)
                // console.log(curSlides)
               //const story= await Story.findByIdAndUpdate(singleStoryId,{$addToSet:{"slidesInStory.$likes":{userId}}},{new:true,runValidators:true});
               // await storyExists.updateOne({slideId }, { $push: { "slidesInStory.$likes": { userId } } })

                // await storyExists.updateOne({"storyExists.slidesInStory":{$addToSet:{likes:userId}}});
              // await storyExists.save();
                // await curSlides.updateOne({$addToSet:{likes:userId}});
                // await curSlides.save();
                // const story=await Story.findByIdAndUpdate(slideId,{$addToSet:{likes:userId}},{new:true,runValidators:true});
            //console.log(storyExists) 
            if(!user.likes.includes(slideId)){
                const curSlides=storyExists.slidesInStory.filter((curSlide)=>curSlide._id==slideId)
              
               
                console.log(curSlides)
                const user=await User.findByIdAndUpdate(userId,{$addToSet:{likes:slideId}},{new:true,runValidators:true});
                curSlides[0].likesCount+=1;
                await storyExists.save()
            
                return res.status(200).json({
                    success: true,
                    message:"Story liked By user",
                    user,storyExists
                  })
                }
            else{
                const curSlides=storyExists.slidesInStory.filter((curSlide)=>curSlide._id==slideId)
              
               
                console.log(curSlides)
                const user=await User.findByIdAndUpdate(userId,{$pull:{likes:slideId}},{new:true,runValidators:true});
                curSlides[0].likesCount-=1;
                await storyExists.save()
               //const story= await Story.findByIdAndUpdate(singleStoryId,{$addToSet:{"slidesInStory.$likes":{userId}}},{new:true,runValidators:true});
                //await storyExists.updateOne({slideId }, { $pull: { "slidesInStory.$likes": { userId } } })
                // curSlides[0].likes.likesCount+=1
               //await storyExists.updateOne({"storyExists.slidesInStory":{$pull:{likes:userId}}});
                // curSlides.likes?.pull(userId)
                //await storyExists.save();
                // await curSlides.updateOne({$pull:{likes:userId}});
                // await curSlides.save();
                // const story=await Story.findByIdAndUpdate(slideId,{$pull:{likes:userId}},{new:true,runValidators:true});
                //console.log(storyExists) 
                
                return res.status(200).json({
                    success: true,
                    message:"Story disliked By user",
                   user,storyExists
                  }) 
            }
                
          
          
          
        } 
        catch (error) {
            console.log(error)
            next(error)
            
        }
    };

   const handleDownload=async(req,res,next)=>
   {
    
       const {url1}=req.body
    try {
        // Fetch the content from the URL
        const response = await axios.get(url1, {
            responseType: 'arraybuffer', // Get the response as a binary buffer
        });

        // Define the filename for the downloaded content
        const filename = 'downloadedContent.html';

        // Set headers to prompt a download
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-Type', 'text/html');

        // Send the content as the response
        res.send(response.data);
    } catch (error) {
        console.error('Error fetching content:', error);
        res.status(500).send('Error fetching content.');
    }
    
    
    
   }
    

   




    const bookmarkSingleSlide=async(req,res,next)=>
    {
                         try{
                            const userId=req.user.id;
                      
                            const slideId =req.params.id
                            const{newBookmarks1}=req.body
                            let allStories=await Story.find();
                            // console.log(newBookmarks1,hasBookmarked)
                            // const slidesToBeFound=allStories[0].slidesInStory.filter((curId)=>curId._id == slideId)
                            // console.log(slidesToBeFound)

                            // slidesToBeFound.hasBookmarked=hasBookmarked
                          const userExists=await User.findById(userId)
                         
                            if(!userExists) {
                                return res.status(401).json({
                                    message: "have to login first to bookmark",
                                    success: false,
                                });

                            }
                         const user=await User.findByIdAndUpdate(userId,{bookmarks:newBookmarks1},{new:true, runValidators: true,
                           useFindAndModify: false})
                           

                                            return res.status(200).json({
                                                       
                                                        success:true,
                                                     
                                                        user
                                                    })

                         }catch(error){
                            console.log(error)
                            next(error)
                         }  
                        }

    const singleBookmarkSlide=async(req,res,next)=>
    {
        try{

        
        const slideId=req.params.id;
        let allStories=await Story.find({})
        const slidesInStory=allStories.map((curStory)=>curStory.slidesInStory.flat())
        // let singleSlide=allStories[0].slidesInStory.filter((curSlide)=>curSlide._id.toString() == slideId.toString())
       let singleSlide=slidesInStory.flat().filter((curSlide)=>curSlide._id == slideId)
            console.log(singleSlide)
        return res.status(200).json({
            success: true,
        singleSlide,
          }) 
    }catch(error){
        console.log(error)
        next(error)
    }

    }
    const getStoriesByCategory=async(req,res,next)=>
    {
        try{
            // const category=req.query.category
            // const queryObject = {};
            // if(category){
            //     queryObject.category=category
            // }
            const categoryArray=req.params.category
            console.log(categoryArray)
             
           let categoryArray1 = categoryArray.split(",").map((category) => category); 
            if(categoryArray1.includes("all")){
                // let categoryArray2=["food","healthandfitness","travel","movie","education"]
                // const storyByCategory=await Story.find({ category: { $in: categoryArray2 } })
                const storyByCategory=await Story.find()
                console.log(storyByCategory,storyByCategory.length)
                return res.status(200).json({
                    success:true,
                    storyByCategory,categoryArray1
                })
            }else if(!categoryArray.includes("all")){

           
            console.log(categoryArray1,categoryArray1[0])
        
        
          
       
          
            const storyByCategory=await Story.find({ category: { $in: categoryArray1 } })
            //const storyByCategory=await Story.find(queryObject)
            console.log(storyByCategory,storyByCategory.length)
            return res.status(200).json({
                success:true,
                storyByCategory,categoryArray1
            })
        }
        }catch(error){
        console.log(error);
            next(error)
        }
    }
    const getSingleStory=async(req,res,next)=>
        {
        try{
        //const userId=req.user._id
        const singleStoryId =req.params.id
        //console.log(storyId)
        const singleStory=await Story.findById(singleStoryId)
        return res.status(200).json({
            success: true,
            singleStory
          })
        }catch(error){
            console.log(error)
                next(error) 
        }
        }
    const editStory=async(req,res,next)=>
        {
            try{
        
               
               const singleStoryId=req.params.id
            const {newSlidesInStory,category} =req.body
            if(!category)  return next(new ErrorHandler("please provide category",400))
  
                if(!newSlidesInStory) return next(new ErrorHandler("cannot have a story without slides",400))
             
                  if(newSlidesInStory.length>6) return next(new ErrorHandler("maximum slides can be 6 in a story",400))
                    
                const storyToUpdate=await Story.findByIdAndUpdate(singleStoryId,{slidesInStory:newSlidesInStory,category:category},
                    {new:true,   runValidators: true,
                    useFindAndModify: false,})
               //console.log(storyToUpdate)
                //await storyToUpdate.save()
                return res.status(200).json({
                    success:true,
                    message:"updated successfully",
                    storyToUpdate,
                })
          
            }
          
            catch(error){
                console.log(error)
                next(error)
            }
        }



            // const bookmarkStory=async(req,res,next)=>
            //     {
            //         try{
                
            //             const userId=req.user._id;
            //             const storyId =req.params.id
            //             console.log(userId)
            //             const user=await User.findById(userId)
            //             if(!user) return next(new ErrorHandler("Have to login first to bookmark",400))
            //             const story=await Story.findById(storyId)
            //             console.log(story)
            //             if(!story) return next(new ErrorHandler("No story available",400))
                  
            //                 if(story.bookmarks.includes(userId)){
            //                 // already bookmarked -> remove from the bookmark
                                
            //                     // await story.updateOne({$pull:{bookmarks:userId}},{new:true});
            //                     // await story.save();
            //                     await Story.findByIdAndUpdate(storyId,{$pull:{bookmarks:userId}},{new:true,   runValidators: true,
            //                          useFindAndModify: false});
            //                     return res.status(200).json({
            //                         success:true,
            //                          message:"Removed from bookmarks.",
                                   
            //                         story
            //                     })
            //                 }else 
            //                 {

            //                     // bookmark krna pdega
            //                     await Story.findByIdAndUpdate(storyId,{$push:{bookmarks:userId}},{new:true,   runValidators: true,
            //                         useFindAndModify: false});
            //                     // await story.updateOne({$push:{bookmarks:userId}},{new:true});
            //                     // await story.save();
            //                     return res.status(200).json({
            //                         success:true,
            //                          message:"Added to boomarks.",
                                   
            //                         story
            //                     })
            //                 }
    
                 
            //             console.log(story)
            //         } 
            //         catch(error){
            //             console.log(error)
            //             next(error)    
            //         }
            //     }
module.exports={createStory,singleBookmarkSlide,handleDownload,
    getAllMyStories,likeOrDislikeStory,getStoriesByCategory,editStory,getSingleStory,bookmarkSingleSlide}

                                