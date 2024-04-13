const Product = require("../models/Product");
const { CustomError } = require("../utils/error");

const getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

const getProductById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const product =
            await Product.findOne({ _id: id });
        if (!product) {
            throw new CustomError(404, `Product with id ${id} not found`);
        }
        res.status(200).json(product);
    }
    catch (error) {
        next(error);
    }
}

const createProduct = async (req, res, next) => {
    try {
        const { name, description, price, quantity, category } = req.body;
        const seller = req.user.id;
        const product = new Product({
            name,
            description,
            price,
            quantity,
            category,
            seller
        });
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        next(error);
    }
}

const updateProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, description, price, quantity, category } = req.body;
        const product = await Product.findOne({ _id: id });
        if (!product) {
            throw new CustomError(404, `Product with id ${id} not found`);
        }
        product.name = name;
        product.description = description;
        product.price = price;
        product.quantity = quantity;
        product.category = category;
        await product.save();
        res.status(200).json(product);
    } catch (error) {
        next(error);
    }
}

const deleteProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const product = await
            Product.findOne({ _id: id });
        if (!product) {
            throw new CustomError(404, `Product with id ${id} not found`);
        }
        await product.remove();
        res.status(204).end();
    }
    catch (error) {
        next(error);
    }
}


const getProductsByCategories = async (req, res, next) => {
    try {
        const { categories } = req.query;
        const categoriesList = categories.split(",");
        const products = await Product.find({ category: { $in: categoriesList } });
        res.status(200).json(products);
    } catch (error) {
        next(error);
    }
}

const getProductsBySeller = async (req, res, next) => {
    try {
        const { id } = req.params;
        const products = await Product.find({ seller: id });
        res.status(200).json(products);
    }
    catch (error) {
        next(error);
    }
}

const purchaseProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const product = await Product.findOne({ _id: id });
        if (!product) {
            throw new CustomError(404, `Product with id ${id} not found`);
        }
        if (product.quantity === 0) {
            throw new CustomError(400, `Product with id ${id} is out of stock`);
        }
        product.quantity -= 1;
        await product.save();
        res.status(200).json(product);
    }
    catch (error) {
        next(error);
    }
}


module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductsByCategories
};

