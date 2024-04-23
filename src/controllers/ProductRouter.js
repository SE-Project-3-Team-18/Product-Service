const Product = require("../models/Product");
const ProductRouter = require("express").Router();
const { request } = require("express");
const { CustomError } = require("../utils/error");

ProductRouter.get("/all", async (request, response, next) => {
  try {
    const products = await Product.find();
    response.status(200).json(products);
  } catch (error) {
    next(error);
  }
});

ProductRouter.get("/:id", async (request, response, next) => {
  try {
    const product = await Product.findById(request.params.id);
    if (!product) {
      throw new CustomError(404, "Product not found");
    }
    response.status(200).json(product);
  } catch (error) {
    next(error);
  }
});

ProductRouter.post("/add", async (request, response, next) => {
  try {
    const product = new Product(request.body);
    const quantity = product.quantity;
    if(quantity < 0){
      throw new CustomError(400, "Quantity can't be negative");
    }
    const price = product.price;
    if(price<0){
      throw new CustomError(400, "Price can't be negative");
    }
    const name = product.name;
    const description = product.description;
    const category = product.category;
    const sellerId = request.get('X-Seller-Id');
    if(!name || !description || !category || !sellerId){
      throw new CustomError(400, "Name, Description , Category and Seller are required");
    }
    await product.save();
    response.status(200).json(product);
  } catch (error) {
    console.log("Error",error)
    next(error);
  }
});

ProductRouter.put("/update/:id", async (request, response, next) => {
  try {
    const ID = request.params.id;
    const product = request.body;
    const old_product = await Product.findById(ID);
    if (!old_product) {
      throw new CustomError(404, "Product not found");
    }
    // validation
    const quantity = product.quantity;
    if(quantity < 0){
      throw new CustomError(400, "Quantity can't be negative");
    }
    const price = product.price;
    if(price<0){
      throw new CustomError(400, "Price can't be negative");
    }
    const name = product.name;
    const description = product.description;
    const category = product.category;
    const sellerId = product.sellerId;
    if(!name || !description || !category || !sellerId){
      throw new CustomError(400, "Name, Description , Category and Seller are required");
    }
    // end of validation
    old_product.name = product.name;
    old_product.price = product.price;
    old_product.description = product.description;
    old_product.quantity = product.quantity;
    old_product.category = product.category;
    const updatedProduct = await old_product.save();
    if (!updatedProduct) {
      throw new CustomError(404, "Product not found");
    }
    response.status(200).json(updatedProduct);
  } catch (error) {
    next(error);
  }
});

ProductRouter.delete("/remove/:id", async (request, response, next) => {
    try {
        const ID = request.params.id;
        const deleted_product = await Product.findByIdAndDelete(ID);
        if (!response) {
            throw new CustomError(404, 'Product not found');
        }
        response.status(200).json(deleted_product);
    } catch (error) {
        next(error);
    }
});

ProductRouter.get("/filter/:category", async (request, response, next) => {
    try {
        const category = request.params.category;
        const products = await Product.find({category: category});
        if (!products) {
            throw new CustomError(404, 'No products found');
        }
        response.status(200).json(products);
    } catch (error) {
        next(error);
    }
})

ProductRouter.put("/buy/:id", async (request, response, next) => {
    try {
        const ID = request.params.id;
        const quantity = request.body.quantity;
        const product = await Product.findById(ID);
        if (!product) {
            throw new CustomError(404, 'Product not found');
        }
        if(product.quantity < quantity){
            throw new CustomError(400, 'Not enough quantity');
        }
        product.quantity -= quantity;
        const updatedProduct = await product.save();
        response.status(200).json(updatedProduct);
    } catch (error) {
        next(error);
    }
})

ProductRouter.put("/refund/:id", async (request, response, next) => {
    try {
        const ID = request.params.id;
        const quantity = request.body.quantity;
        const product = await Product.findById(ID);
        if (!product) {
            throw new CustomError(404, 'Product not found');
        }
        product.quantity += quantity;
        const updatedProduct = await product.save();
        response.status(200).json(updatedProduct);
    } catch (error) {
        next(error);
    }
})

module.exports = ProductRouter;
