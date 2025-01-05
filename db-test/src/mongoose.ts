import mongoose from 'mongoose';
import Product from './models/product';
import { NextFunction, Request, Response } from 'express';
import { config } from './config';

const url = `mongodb://${config.MONGO_DB_USER}:${config.MONGO_DB_PASSWORD}@localhost:27017/?authSource=admin`;
const dbName = 'mern';

mongoose
    .connect(url, { dbName })
    .then(() => {
        console.log(`Connected to database!`);
    })
    .catch(() => {
        console.log(`Connection failed`);
    });

const createProduct = async (req: Request, res: Response, next: NextFunction) => {
    const { name, price } = req.body;
    const createdProduct = new Product({
        name,
        price,
    });

    const result = await createdProduct.save();
    // console.log(typeof createdProduct.id);

    res.json(result);
};

const getProducts = async (req: Request, res: Response, next: NextFunction) => {
    const products = await Product.find().exec();
    res.json(products);
};

const mongoDBM = {
    createProduct,
    getProducts,
};

export default mongoDBM;
