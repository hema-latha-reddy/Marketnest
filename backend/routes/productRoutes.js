const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const auth = require('../middleware/auth');  // Only this middleware

// Public routes - Get all products (marketplace)
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 12, search = '', category = '' } = req.query;
    
    const filter = {
      status: 'published',
      isArchived: { $ne: true }
    };
    
    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }
    
    if (category && category !== 'All Categories') {
      filter.category = category;
    }
    
    const skip = (page - 1) * limit;
    
    const products = await Product.find(filter)
      .populate('brand', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));
    
    const total = await Product.countDocuments(filter);
    
    res.json({
      products,
      currentPage: Number(page),
      totalPages: Math.ceil(total / limit),
      totalProducts: total
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('brand', 'name email');
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get brand dashboard summary (Brand only)
router.get('/brand/summary', auth, async (req, res) => {
  try {
    if (req.user.role !== 'brand') {
      return res.status(403).json({ message: 'Access denied. Brand access required.' });
    }
    
    const total = await Product.countDocuments({ brand: req.user.id });
    const published = await Product.countDocuments({ 
      brand: req.user.id, 
      status: 'published',
      isArchived: { $ne: true }
    });
    const archived = await Product.countDocuments({ 
      brand: req.user.id, 
      isArchived: true 
    });
    
    res.json({ total, published, archived });
  } catch (error) {
    console.error('Error fetching summary:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get brand's products (Brand only)
router.get('/brand/products', auth, async (req, res) => {
  try {
    if (req.user.role !== 'brand') {
      return res.status(403).json({ message: 'Access denied. Brand access required.' });
    }
    
    const products = await Product.find({ brand: req.user.id })
      .sort({ createdAt: -1 });
    
    res.json(products);
  } catch (error) {
    console.error('Error fetching brand products:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create product (Brand only)
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'brand') {
      return res.status(403).json({ message: 'Only brands can create products' });
    }
    
    const { name, description, price, category, status, images } = req.body;
    
    if (!name || !description || !price || !category || !images || images.length === 0) {
      return res.status(400).json({ message: 'Please provide all required fields including images' });
    }
    
    const product = new Product({
      name,
      description,
      price,
      category,
      status: status || 'draft',
      images,
      brand: req.user.id
    });
    
    await product.save();
    
    res.status(201).json({ 
      message: 'Product created successfully', 
      product 
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update product (Brand only - with ownership check)
router.put('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'brand') {
      return res.status(403).json({ message: 'Only brands can update products' });
    }
    
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // CRITICAL: Ownership check - Brand can only edit their own products
    if (product.brand.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You can only edit your own products' });
    }
    
    const { name, description, price, category, status, images } = req.body;
    
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name: name || product.name,
        description: description || product.description,
        price: price || product.price,
        category: category || product.category,
        status: status || product.status,
        images: images || product.images
      },
      { new: true }
    );
    
    res.json({ 
      message: 'Product updated successfully', 
      product: updatedProduct 
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Archive product (soft delete) - Brand only with ownership check
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'brand') {
      return res.status(403).json({ message: 'Only brands can delete products' });
    }
    
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // CRITICAL: Ownership check - Brand can only delete their own products
    if (product.brand.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You can only delete your own products' });
    }
    
    // Soft delete - just mark as archived
    product.isArchived = true;
    await product.save();
    
    res.json({ message: 'Product archived successfully' });
  } catch (error) {
    console.error('Error archiving product:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;