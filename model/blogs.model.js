const mongoose=require("mongoose");
const blogSchema=mongoose.Schema({
    blog:String,
    user:String
},{
    versionKey:false
});

const BlogModel=mongoose.model("blog",blogSchema);

module.exports={BlogModel};