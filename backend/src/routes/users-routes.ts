import express from 'express';
import userControllers from '../controllers/users-controllers';
import { check } from 'express-validator';
import { fileUpload } from '../middleware/file-upload';
export const userRouter = express.Router();

userRouter.get(
    '/',
    //
    userControllers.getUsers
);

userRouter.post(
    '/signup',
    fileUpload.single('image'),
    [check('name').not().isEmpty(), check('email').normalizeEmail().isEmail(), check('password').isLength({ min: 6 })],
    userControllers.signup as express.RequestHandler
);

userRouter.post(
    '/login',
    //
    userControllers.login
);
