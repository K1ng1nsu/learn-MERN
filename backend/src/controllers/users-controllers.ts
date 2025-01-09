import { NextFunction, Request, Response } from 'express';
import { randomUUID } from 'node:crypto';
import { isFalsy } from '../util/insu-utils';
import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
//models
import { HttpError } from '../models/http-error';
import User from '../models/User';
import { config } from '../util/config';

const getUsers = async (req: Request, res: Response, next: NextFunction) => {
    let users;
    try {
        users = await User.find({}, '-password');
    } catch (err) {
        return next(new HttpError('Fetching users failed, please try again later.', 500));
    }

    res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

const signup = async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs passed, please check your data.', 400));
    }

    const { name, email, password } = req.body;

    try {
        const hasUser = !!(await User.findOne({ email }));
        if (hasUser) {
            return next(new HttpError('e-mail address already registered', 400));
        }
    } catch (err) {
        return next(new HttpError('Could not create user, please try again', 500));
    }

    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(password, 12);
    } catch (err) {
        return next(new HttpError('사용자를 생성할 수 없습니다.', 500));
    }

    const createdUser = new User({
        name,
        email,
        image: req.file?.path,
        password: hashedPassword,
        places: [],
    });

    try {
        await createdUser.save();
    } catch (err) {
        return next(new HttpError('Could not sign up , please try again', 500));
    }

    let token;
    try {
        token = jwt.sign({ userId: createdUser.id, email: createdUser.email }, config.JWT_PRIVATE_KEY!, {
            expiresIn: '1h',
        });
    } catch (err) {
        return next(new HttpError('Could not sign up , please try again', 500));
    }

    res.status(201).json({ user: { userId: createdUser.id, email: createdUser.email }, token: token });
};

const login = async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs passed, please check your data.', 400));
    }

    const { email, password } = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({ email });
    } catch (err) {
        return next(new HttpError('로그인을 할 수 없습니다.', 500));
    }

    if (!existingUser) {
        return next(new HttpError('존재하지 않는 유저', 404));
    }

    let isValidPassword = false;
    try {
        isValidPassword = await bcrypt.compare(password, existingUser.password);
    } catch (err) {
        return next(new HttpError('로그인을 할 수 없습니다. - 내부 서버 오류류', 500));
    }

    if (!isValidPassword) {
        return next(new HttpError('Could not identify user, credentials seem to be wrong', 401));
    }

    let token;
    try {
        token = jwt.sign({ userId: existingUser.id, email: existingUser.email }, config.JWT_PRIVATE_KEY!, {
            expiresIn: '1h',
        });
    } catch (err) {
        return next(new HttpError('로그인을 할 수 없습니다. - 내부 서버 오류류', 500));
    }

    res.json({ user: { userId: existingUser.id, email: existingUser.email }, token: token });
};

const userControllers = {
    getUsers,
    signup,
    login,
};

export default userControllers;
