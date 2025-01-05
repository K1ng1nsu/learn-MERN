import { NextFunction, Request, Response } from 'express';
import { MongoClient } from 'mongodb';
import { config } from './config';

const url = `mongodb://${config.MONGO_DB_USER}:${config.MONGO_DB_PASSWORD}@localhost:27017/?authSource=admin`;
const dbName = 'mern';
const createProduct = async (req: Request, res: Response, next: NextFunction) => {
    const { name, price } = req.body;

    const newProduct = {
        name,
        price,
    };
    const client = new MongoClient(url);

    try {
        await client.connect();
        const db = client.db(dbName);
        // const result = db.collection('products').insertOne(newProduct);
        const result = await db.collection('products').insertOne(newProduct);
        // 삽입 결과 확인
        if (result.insertedId) {
            console.log(result.insertedId);
        }
    } catch (error) {
        console.error(error);

        return res.json({ message: 'could not store data.' });
    }
    client.close();
    res.json(newProduct);
};
const getProducts = async (req: Request, res: Response, next: NextFunction) => {
    const client = new MongoClient(url);

    let products;

    try {
        await client.connect();
        const db = client.db(dbName);
        products = await db.collection('products').find().toArray();
    } catch (error) {
        console.error(error);
        return res.json({ message: 'could not retrieve products' });
    }
    client.close();

    res.json(products);
};

const mongoDB = {
    createProduct,
    getProducts,
};

export default mongoDB;

// 스키마 -> 모델
// 클래스 -> 오브젝트
