const mongoose = require("mongoose")
const { Schema } = require("mongoose")

const slideSchema = new Schema({
    id1: {
        type: String,

    },
   heading: {
        type: String,
       // required:true

    },
  
   description:{
    type:String,
    //required:true
   },
    imageOrVideoUrl:{
    type:String
    },

   likesCount:{
    type:Number,
    default:0
   },
    imageUrl:{
        type: String,
        
    } ,
    
//    hasBookmarked:{
// type:String
//    },
       
 
//    category:{
//     type:String,
//     enum:["food","healthandfitness","travel","movie","education"],
//     required:true
//     },
   creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
},

});

const storySchema = new mongoose.Schema({
   
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
   
    category:{
        type:String,
        enum:["food","healthandfitness","travel","movie","education"],
        required:true
    },
   
    createdAt: {
        type: Date,
        default: Date.now(),
    },
  
    // bookmarks:[{
    //  type:mongoose.Schema.Types.ObjectId, ref:'Story'
    // }],

    slidesInStory: [slideSchema],

 
})

module.exports = mongoose.model("Story", storySchema)