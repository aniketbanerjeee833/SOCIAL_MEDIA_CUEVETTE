const express =require("express");
const { createStory,getAllMyStories, likeOrDislikeStory,getStoriesByCategory, 
    editStory,getSingleStory, bookmarkSingleSlide, singleBookmarkSlide, handleDownload,} = require("../controllers/storyController");
const isAuthenticated = require("../middlewares/auth");


//const { isAuthenticated } = require("../middlewares/auth");


const router=express.Router()
router.get("/singleStory/:id", getSingleStory)
router.post("/create",isAuthenticated,createStory)
router.get("/allStories",isAuthenticated,getAllMyStories)

router.put("/likeOrDislike/:id", isAuthenticated,likeOrDislikeStory)
router.get("/storiesByCategory/:category",getStoriesByCategory)
router.put("/update/:id",isAuthenticated, editStory);

router.patch("/bookmarkSingleSlide/:id", isAuthenticated, bookmarkSingleSlide)

router.get("/bookmarkSingleSlide/:id", isAuthenticated, singleBookmarkSlide)
router.get("/handleDownload", isAuthenticated, handleDownload)


module. exports = router