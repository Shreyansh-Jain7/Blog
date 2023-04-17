const express=require("express");
const userRouter=express.Router();
const jwt=require("jsonwebtoken");
const bcrypt=require("bcrypt");
require("dotenv").config();
const {UserModel}=require("../model/users.model");
const {Blacklist}=require("../model/blacklist.model");

userRouter.post("/register",async(req,res)=>{
    const {username,password}=req.body;
    try {
        const user=await UserModel.find({username});
        if(user.length==0){
            bcrypt.hash(password,5,async(err,hash)=>{
                const new_user=new UserModel({username,password:hash});
                await new_user.save();
                res.status(200).send({"msg":"User has been added"});
            })
        }else{
            res.status(400).send({"msg":"User already exists. Try another username"});
        }
    } catch (error) {
        res.status(400).send({"msg":error.message});
    }
})

userRouter.post("/login",async(req,res)=>{
    const {username,password}=req.body
    try {
        const user=await UserModel.find({username});
        if(user.length>0){
            bcrypt.compare(password,user[0].password,(err,result)=>{
                if(result){
                    const token=jwt.sign({userId:user[0]._id},process.env.jwtsecret,{expiresIn:60});
                    const refresh=jwt.sign({userId:user[0]._id},process.env.refreshsecret,{expiresIn:180});
                    res.status(200).send({"msg":"Login Successful","token":token,"refreshToken":refresh})
                }else{
                    res.status(400).send({"msg":"Wrong credentials"})
                }
            })
        }else{
            res.status(400).send({"msg":"Wrong credentials"})
        }
    } catch (error) {
        res.status(400).send({"msg":error.message});
    }
})

userRouter.post("/logout",async(req,res)=>{
    try {
        const token=req.headers.auhtorization.split(" ")[1];
        const blacklisted=new Blacklist({token});
        await blacklisted.save();
        res.status(200).send({"msg":"Logged Out"})
    } catch (error) {
        res.status(400).send({"msg":error.message});
    }
})

userRouter.post("/refresh",async(req,res)=>{
    const {username,refresh}=req.body;
    try {
        const decoded=jwt.verify(refresh,process.env.refreshsecret);
        const user= await UserModel.find({username});

        if(user.length>0 && user[0]._id==decoded.userId){
            const token=jwt.sign({userId:user[0]._id},process.env.jwtsecret,{expiresIn:60});
            res.status(200).send({"newToken":token});
        }else{
            res.status(400).send({"msg":"Unauthorized"});
        }
    } catch (error) {
        res.status(400).send({"msg":error.message});
    }
})

module.exports={userRouter};