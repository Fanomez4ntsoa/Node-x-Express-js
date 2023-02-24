const mongoose = require('mongoose');

// Declare the Schema of the Mongo model
var categoryBlogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    index: true,
  }
}, {
  timestamps: true,
});

// Export the model
module.exports = mongoose.model("Blog_Category", categoryBlogSchema);