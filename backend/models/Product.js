const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative'],
    validate: {
      validator: function(value) {
        return value >= 0;
      },
      message: 'Price must be a positive number'
    }
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
    enum: {
      values: ['Men', 'Women', 'Kids', 'Accessories'],
      message: 'Category must be Men, Women, Kids, or Accessories'
    }
  },
  status: {
    type: String,
    enum: {
      values: ['draft', 'published'],
      message: 'Status must be either draft or published'
    },
    default: 'draft'
  },
  images: [{
    type: String,
    required: [true, 'At least one product image is required'],
    validate: {
      validator: function(images) {
        return images && images.length > 0;
      },
      message: 'At least one image is required'
    }
  }],
  brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Brand ID is required']
  },
  isArchived: {
    type: Boolean,
    default: false,
    description: 'Soft delete flag - when true, product is archived/soft-deleted'
  }
}, {
  timestamps: true  // Automatically adds createdAt and updatedAt fields
});

// Create indexes for better query performance
productSchema.index({ name: 'text' });  // Text index for search functionality
productSchema.index({ category: 1 });    // Index for category filtering
productSchema.index({ price: 1 });       // Index for price sorting/filtering
productSchema.index({ brand: 1 });       // Index for brand queries
productSchema.index({ status: 1 });      // Index for filtering by status
productSchema.index({ isArchived: 1 });  // Index for filtering archived products

// Compound index for common queries
productSchema.index({ status: 1, isArchived: 1, createdAt: -1 });
productSchema.index({ brand: 1, status: 1, isArchived: 1 });

// Virtual field for discount price (if you want to add discounts later)
productSchema.virtual('discountedPrice').get(function() {
  if (this.discount && this.discount > 0) {
    return this.price * (1 - this.discount / 100);
  }
  return this.price;
});

// Method to check if product is available (published and not archived)
productSchema.methods.isAvailable = function() {
  return this.status === 'published' && !this.isArchived;
};

// Static method to get available products
productSchema.statics.getAvailableProducts = function() {
  return this.find({
    status: 'published',
    isArchived: { $ne: true }
  });
};

// Pre-save middleware to ensure data consistency
productSchema.pre('save', function(next) {
  // Trim whitespace from name and description
  if (this.name) this.name = this.name.trim();
  if (this.description) this.description = this.description.trim();
  
  // Ensure price is a number
  if (this.price) this.price = Number(this.price);
  
  next();
});

// Pre-remove middleware (if you ever want hard delete)
productSchema.pre('remove', async function(next) {
  console.log(`Product ${this._id} is being hard deleted`);
  // You could add logic here to clean up images from Cloudinary/AWS
  next();
});

// To JSON transformation (exclude sensitive fields if any)
productSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    ret.id = ret._id;
    delete ret.__v;
    return ret;
  }
});

// To Object transformation
productSchema.set('toObject', {
  virtuals: true,
  transform: function(doc, ret) {
    ret.id = ret._id;
    delete ret.__v;
    return ret;
  }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;