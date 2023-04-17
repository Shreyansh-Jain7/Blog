const express=require("express");
const {connection}=require("./db");
require("dotenv").config();
const {userRouter}=require("./route/user.routes");
const {blogRouter}=require("./route/blog.routes");
const cors=require("cors");
const {auth}=require("./middleware/auth.middleware");
const app=express();
app.use(cors());
app.use(express.json());

app.get("/",(req,res)=>{
    res.send("welcome to blogs");
})

app.use("/users",userRouter);
app.use(auth);
app.use("/blogs",blogRouter)


app.listen(process.env.port,async()=>{
    try {
        await connection;
        console.log(`Connected to MongoDB Atlas at port ${process.env.port}.`);
    } catch (error) {
        console.log(error.message);
    }
})