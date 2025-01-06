import { NextFunction, Request, Response } from 'express';
import { randomUUID } from 'node:crypto';
import { isFalsy } from '../util/insu-utils';
import { validationResult } from 'express-validator';

//models
import { HttpError } from '../models/http-error';
import User from '../models/User';

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

    const createdUser = new User({
        name,
        email,
        password,
    });

    try {
        await createdUser.save();
    } catch (err) {
        return next(new HttpError('Could not sign up , please try again', 500));
    }

    res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const login = async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs passed, please check your data.', 400));
    }

    const { email, password } = req.body;

    const identifiedUser = await User.findOne({ email, password });

    if (!identifiedUser) {
        return next(new HttpError('Could not identify user, credentials seem to be wrong', 401));
    } else {
        res.json({ message: 'Logged in!' });
    }
};

const userControllers = {
    getUsers,
    signup,
    login,
};

export default userControllers;
