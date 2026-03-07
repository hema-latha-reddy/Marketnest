const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({

 name:{
  type:String,
  required:true
 },

 price:{
  type:Number,
  required:true
 },

 category:{
  type:String,
  required:true
 },

 images:[
  {
   type:String
  }
 ],

 brand:{
  type:mongoose.Schema.Types.ObjectId,
  ref:"User"
 },

 status:{
  type:String,
  enum:["draft","published","archived"],
  default:"draft"
 }

},{timestamps:true});

module.exports = mongoose.model("Product",ProductSchema);