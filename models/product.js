const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Product title is required"],
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Product seller is required"],
  },
  condition: {
    type: String,
    required: [true, "Product condition is required"],
  },
  price: {
    type: Number,
    required: [true, "Product price is required"],
  },
  description: {
    type: String,
    required: [true, "Product description is required"],
  },
  tags: {
    type: [String],
    required: [true, "Product tags are required"],
  },
  image: {
    type: String,
    required: [true, "Product image is required"],
  },
  active: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("Product", productSchema);
