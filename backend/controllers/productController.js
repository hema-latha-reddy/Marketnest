const Product = require("../models/Product");

/* ---------------- CREATE PRODUCT ---------------- */

exports.createProduct = async (req,res)=>{

 try{

  const {name,price,category,status} = req.body;

  const images = req.files ? req.files.map(f=>f.path) : [];

  const product = await Product.create({
   name,
   price,
   category,
   status,
   images,
   brand:req.user.id
  });

  res.json(product);

 }catch(err){
  res.status(500).json({message:"Error creating product"});
 }

};


/* ---------------- GET MARKETPLACE PRODUCTS ---------------- */

exports.getProducts = async (req,res)=>{

 try{

  const {search,category,page=1,limit=6} = req.query;

  const query = {status:"published"};

  if(search){
   query.name = {$regex:search,$options:"i"};
  }

  if(category && category !== "All Categories"){
    query.category = { $regex: category, $options: "i" };
   }

  const products = await Product
  .find(query)
  .skip((page-1)*limit)
  .limit(parseInt(limit))
  .populate("brand","name");

  res.json(products);

 }catch(err){
  res.status(500).json({message:"Error fetching products"});
 }

};


/* ---------------- GET PRODUCT DETAILS ---------------- */

exports.getProductById = async (req,res)=>{

 try{

  const product = await Product
  .findById(req.params.id)
  .populate("brand","name");

  res.json(product);

 }catch(err){
  res.status(500).json({message:"Error fetching product"});
 }

};


/* ---------------- UPDATE PRODUCT ---------------- */

exports.updateProduct = async (req,res)=>{

 try{

  const product = await Product.findById(req.params.id);

  if(product.brand.toString() !== req.user.id){
   return res.status(403).json({message:"Unauthorized"});
  }

  const updated = await Product.findByIdAndUpdate(
   req.params.id,
   req.body,
   {new:true}
  );

  res.json(updated);

 }catch(err){
  res.status(500).json({message:"Error updating product"});
 }

};


/* ---------------- ARCHIVE PRODUCT ---------------- */

exports.deleteProduct = async (req,res)=>{

 try{

  const product = await Product.findById(req.params.id);

  if(product.brand.toString() !== req.user.id){
   return res.status(403).json({message:"Unauthorized"});
  }

  product.status = "archived";

  await product.save();

  res.json(product);

 }catch(err){
  res.status(500).json({message:"Error archiving product"});
 }

};



/* ---------------- DASHBOARD SUMMARY ---------------- */

exports.dashboardSummary = async (req,res)=>{

 try{

  const brandId = req.user.id;

  const total = await Product.countDocuments({brand:brandId});

  const published = await Product.countDocuments({
   brand:brandId,
   status:"published"
  });

  const archived = await Product.countDocuments({
   brand:brandId,
   status:"archived"
  });

  res.json({total,published,archived});

 }catch(err){
  res.status(500).json({message:"Error loading summary"});
 }

};

exports.getBrandProducts = async (req,res)=>{

    try{
   
     const products = await Product.find({
      brand:req.user.id
     });
   
     res.json(products);
   
    }catch(err){
   
     res.status(500).json({message:"Error fetching brand products"});
   
    }
   
   };