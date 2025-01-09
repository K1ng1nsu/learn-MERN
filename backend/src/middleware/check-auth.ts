import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../models/http-error';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { config } from '../util/config';

export interface CustomJwtPayload extends jwt.JwtPayload {
    userId: string;
}

export const checkJwtToken = (req: Request, res: Response, next: NextFunction) => {
    if (req.method === 'OPTIONS') {
        return next();
    }
    try {
        const token = req.headers.authorization?.split(' ')[1]; // Authorization: 'Bearer TOKEN'

        if (!token) {
            throw new Error('Authentication failed');
        }

        // validation
        const decodedToken = jwt.verify(token, config.JWT_PRIVATE_KEY!) as CustomJwtPayload;
        req.userData = { userId: decodedToken.userId };
        next();
    } catch (err) {
        const error = new HttpError('Authentication failed', 401);
        return next(error);
    }
};
