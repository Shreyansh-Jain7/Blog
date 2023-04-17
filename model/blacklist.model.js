const mongoose=require("mongoose");
const blackListSchema=new mongoose.Schema({
    token:String
},{
    versionKey:false
});

const Blacklist=mongoose.model("blacklist",blackListSchema);

module.exports={Blacklist};