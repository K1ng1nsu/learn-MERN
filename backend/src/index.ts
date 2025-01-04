import express, { NextFunction, Request, Response } from 'express';
//
import { placesRouter } from './routes/places-routes';
import { userRouter } from './routes/users-routes';
import { HttpError } from './models/http-error';
import { config } from './util/config';
const app = express();
const port = 5000;

// 데이터 파싱
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// &데이터 파싱

// places routes     => /api/places/ ...
app.use('/api/places', placesRouter);

// users routes => /api/places/ ...
app.use('/api/users', userRouter);

// notfound middle ware
app.use((req, res, next) => {
    const error = new HttpError('Could not find this route.', 404);
    next(error);
});

app.use((error: HttpError, req: Request, res: Response, next: NextFunction) => {
    // console.log(error.stack);
    if (res.headersSent) {
        return next(error);
    } else {
        res.status(error.statusCode || 500);
        res.json({ message: error.message || 'An unknown error occurred!' });
    }
});

app.listen(port, () => {
    // console.log(`port: ${port}`);
    // console.log(`api key : ${config.GOOGLE_API_KEY}`);
});
