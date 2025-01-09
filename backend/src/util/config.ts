import * as dotenv from 'dotenv';

// .env 파일 로드
dotenv.config();

export const config = {
    PORT: process.env.PORT || 5000,
    MONGO_DB_URL: `mongodb://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@localhost:27017/?authSource=admin`,
    MONGO_DB_NAME: 'mern',
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
    JWT_PRIVATE_KEY: process.env.JWT_PRIVATE_KEY,
};
