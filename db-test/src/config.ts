import * as dotenv from 'dotenv';
dotenv.config();

export const config = {
    MONGO_DB_USER: process.env.MONGO_DB_USER,
    MONGO_DB_PASSWORD: process.env.MONGO_DB_PASSWORD,
};
