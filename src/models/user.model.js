// Not need to write id, since mongodb already generate user id, when it saves the use

import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const userSchema=new Schema(
    {
        userName:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
            index:true, // so that we can search it easily
        },
        email:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
        },
        fullName:{
            type:String,
            required:true,
            trim:true,
            index:true,
        },
        avatar:{
            type:String, //cloudinary url
            required:true,
        },
        coverImage:{
            type:String,
        },
        watchHistory:[
            {
                type:Schema.Types.ObjectId,
                ref:"Video"
            }
        ],
        passWord:{
            type:String,
            required:[true, "Password is required"]
        },
        refreshToken:{
            type:true,
        },
    },
    {
        timestamps:true,
    }
);

userSchema.pre("save", async function(next){
    if(!this.isModified("passWord")){ //so that password will not modified in each minor update
        return next();
    } 
    this.passWord=await bcrypt.hash(this.passWord,10)
    next()
})

userSchema.methods.isPasswordCorrect=async function(passWord){
    return await bcrypt.compare(passWord, this.passWord);
}

userSchema.methods.generateAccessToken=function(){
    return jwt.sign(
        {
            _id:this._id,
            email:this.email,
            userName:this.userName,
            fullName:this.fullName,
            // key : comming from DB
        },
        process.env.ACCESS_TOKON_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKON_EXPIRY,
        }
    )
}
userSchema.methods.generateRefreshToken=function(){
    return jwt.sign(
        {
            _id:this._id,
            // key : comming from DB
        },
        process.env.REFRESH_TOKON_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKON_EXPIRY,
        }
    )
}

export const User=mongoose.model("User", userSchema);
