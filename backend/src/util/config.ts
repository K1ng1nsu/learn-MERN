import * as dotenv from 'dotenv';

// .env 파일 로드
dotenv.config();

export const config = {
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
};
