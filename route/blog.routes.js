const express=require("express");
const {BlogModel}=require("../model/blogs.model");
const blogRouter=express.Router();

blogRouter.get("/",async(req,res)=>{
    const user=req.user;
    try {
        const blogs= await BlogModel.find({user});
        res.status(200).send(blogs);
    } catch (error) {
        res.status(400).send({"msg":error.message});
    }
})

blogRouter.post("/add",async(req,res)=>{
    try {
        const blog=new BlogModel(req.body);
        await blog.save();
        res.status(200).send({"msg":"Blog added"});
    } catch (error) {
        res.status(400).send({"msg":error.message});
    }
})

blogRouter.patch("/update/:id",async(req,res)=>{
    const user=req.user;
    const _id=req.params.id;
    try {
        const blog= await BlogModel.findById(_id);
        if(blog.user==user){
            await BlogModel.findByIdAndUpdate({_id},req.body);
            res.status(200).send({"msg":"Blog has been updated"});
        }else{
            res.status(400).send({"msg":"You dont have a blog by that id"});
        }
    } catch (error) {
        res.status(400).send({"msg":error.message});
    }
})

blogRouter.patch("/update/:id",async(req,res)=>{
    const user=req.user;
    const _id=req.params.id;
    try {
        const blog= await BlogModel.findById(_id);
        if(blog.user==user){
            await BlogModel.findByIdAndUpdate({_id},req.body);
            res.status(200).send({"msg":"Blog has been updated"});
        }else{
            res.status(400).send({"msg":"You dont have a blog by that id"});
        }
    } catch (error) {
        res.status(400).send({"msg":error.message});
    }
})

blogRouter.delete("/delete/:id",async(req,res)=>{
    const user=req.user;
    const _id=req.params.id;
    try {
        const blog= await BlogModel.findById(_id);
        if(blog.user==user){
            await BlogModel.findByIdAndDelete({_id},req.body);
            res.status(200).send({"msg":"Blog has been deleted"});
        }else{
            res.status(400).send({"msg":"You dont have a blog by that id"});
        }
    } catch (error) {
        res.status(400).send({"msg":error.message});
    }
})


module.exports={blogRouter};