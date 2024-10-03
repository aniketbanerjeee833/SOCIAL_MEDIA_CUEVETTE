const express =require("express");
const { register, login, getUser,  logout,  getLikesCount, viewBookmarkStory, getAllStories } = require("../controllers/userController");
const isAuthenticated = require("../middlewares/auth");

//const{isAuthenticated}=require("../middlewares/auth")

const router=express.Router()

router.post("/register", register);
router.post("/login", login);
router.get("/logout",isAuthenticated ,logout)

router.get("/me", isAuthenticated, getUser);

router.get("/allStories",getAllStories)
 router.get("/bookmarkStories",isAuthenticated,viewBookmarkStory)
router.get("/likeSlidesCount/:singleStoryId/:slideId",getLikesCount)

module. exports = router