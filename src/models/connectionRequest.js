const mongoose = require("mongoose");
const connectionRequestSchema = mongoose.Schema({
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"
    },
    status:{
        type:String,
        required:true,
        enum:{
            values:["interested","ignored","accepted","rejected"],
            message:'${VALUE} not a valid status'
        }
    }
},{timestamps:true});

connectionRequestSchema.index({fromUserId:1,toUserId:1});
connectionRequestSchema.pre("save",function(next){
    const conn = this;
    if(conn.fromUserId.equals(conn.toUserId)) {
        throw new Error("cant send req to itself");
    }
    next();
})
const ConnectionRequest =  mongoose.model("ConnectionRequest",connectionRequestSchema);
module.exports=ConnectionRequest;