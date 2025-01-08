import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
//
import { placesRouter } from './routes/places-routes';
import { userRouter } from './routes/users-routes';
import { HttpError } from './models/http-error';
import { config } from './util/config';
const app = express();

// START 데이터 파싱
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// END 데이터 파싱

// Image middleware
app.use('/uploads/images', express.static(path.join('uploads', 'images')));
// END Image middleware

// Header 추가
// CORS 설정
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authrization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');

    next();
});

// START ROUTES
// places routes     => /api/places/ ...
app.use('/api/places', placesRouter);

// users routes => /api/places/ ...
app.use('/api/users', userRouter);

// END ROUTES

// notfound middle ware
app.use((req, res, next) => {
    const error = new HttpError('Could not find this route.', 404);
    next(error);
});

app.use((error: HttpError, req: Request, res: Response, next: NextFunction) => {
    if (req.file) {
        fs.unlink(req.file.path, (err) => {
            console.log(err);
        });
    }
    // console.log(error.stack);
    if (res.headersSent) {
        return next(error);
    } else {
        res.status(error.statusCode || 500);
        res.json({ message: error.message || 'An unknown error occurred!' });
    }
});

mongoose
    .connect(config.MONGO_DB_URL, { dbName: config.MONGO_DB_NAME })
    .then(() => {
        console.log(`MONGO DB STARED, DB_NAME: ${config.MONGO_DB_NAME}`);

        app.listen(config.PORT, () => {
            console.log(`MERN APP STARTED`);
            console.log(`port: ${config.PORT}`);
        });
    })
    .catch((error) => {
        console.log(error);
    });
