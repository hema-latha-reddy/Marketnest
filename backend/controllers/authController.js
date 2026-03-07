const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// =====================
// SIGNUP
// =====================

exports.signup = async (req,res)=>{

  try{
 
   const {name,email,password,role} = req.body;
 
   const existingUser = await User.findOne({email});
 
   if(existingUser){
    return res.status(400).json({
     message:"User already exists"
    });
   }
 
   const hashedPassword = await bcrypt.hash(password,10);
 
   const user = await User.create({
    name,
    email,
    password:hashedPassword,
    role
   });
 
   res.json({
    message:"Account created successfully"
   });
 
  }catch(err){
 
   res.status(500).json({
    message:"Signup failed"
   });
 
  }
 
 };



// =====================
// LOGIN
// =====================

exports.login = async (req,res)=>{

  try{
 
   const {email,password} = req.body;
 
   const user = await User.findOne({email});
 
   if(!user){
    return res.status(400).json({
     message:"Invalid credentials"
    });
   }
 
   const isMatch = await bcrypt.compare(password,user.password);
 
   if(!isMatch){
    return res.status(400).json({
     message:"Invalid credentials"
    });
   }
 
   const token = jwt.sign(
    {
     id:user._id,
     role:user.role
    },
    process.env.JWT_SECRET,
    {expiresIn:"1d"}
   );
 
   res.json({
    token,
    user:{
     id:user._id,
     role:user.role,
     name:user.name
    }
   });
 
  }catch(err){
 
   res.status(500).json(err);
 
  }
 
 };


// =====================
// REFRESH TOKEN
// =====================

exports.refreshToken = (req,res)=>{

 const token = req.cookies.refreshToken;

 if(!token){
  return res.status(401).json({message:"No refresh token"});
 }

 try{

 const decoded = jwt.verify(
  token,
  process.env.JWT_REFRESH_SECRET
 );

 const newAccessToken = jwt.sign(
  {id:decoded.id},
  process.env.JWT_SECRET,
  {expiresIn:"15m"}
 );

 res.json({token:newAccessToken});

 }catch(err){
  res.status(403).json({message:"Invalid refresh token"});
 }

};



// =====================
// LOGOUT
// =====================

exports.logout = (req,res)=>{

 res.clearCookie("refreshToken");

 res.json({message:"Logged out successfully"});

};



// =====================
// FORGOT PASSWORD
// =====================

exports.forgotPassword = async (req,res)=>{

  try{
 
   const {email,newPassword} = req.body;
 
   const user = await User.findOne({email});
 
   if(!user){
    return res.status(404).json({
     message:"User not found"
    });
   }
 
   if(newPassword.length < 6){
    return res.status(400).json({
     message:"Password must be at least 6 characters"
    });
   }
 
   const hashed = await bcrypt.hash(newPassword,10);
 
   user.password = hashed;
 
   await user.save();
 
   res.json({
    message:"Password updated successfully"
   });
 
  }catch(err){
   res.status(500).json(err);
  }
 
 };