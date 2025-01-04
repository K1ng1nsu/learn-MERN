import e, { NextFunction, Request, Response } from 'express';
import { randomUUID } from 'node:crypto';
import { HttpError } from '../models/http-error';
import { isFalsy } from '../util/insu-utils';
import { validationResult } from 'express-validator';

const DUMMY_USERS = [{ id: 'u1', name: 'insu', email: 'test@test.com', password: 'test12' }];

const getUsers = (req: Request, res: Response, next: NextFunction) => {
    res.json({ users: DUMMY_USERS });
};

const signup = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new HttpError('Invalid inputs passed, please check your data.', 400);
    }

    const { name, email, password } = req.body;

    if (isFalsy(name, email, password)) {
        throw new HttpError('bad request', 400);
    }
    const hasUser = DUMMY_USERS.find((user) => user.email === email);
    if (hasUser) {
        throw new HttpError('Could not create user, email already exists.', 401);
    }

    const createdUser = {
        id: randomUUID(),
        name,
        email,
        password,
    };

    DUMMY_USERS.push(createdUser);

    res.status(201).json({ user: createdUser });
};

const login = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new HttpError('Invalid inputs passed, please check your data.', 400);
    }

    const { email, password } = req.body;

    const identifiedUser = DUMMY_USERS.find((user) => user.email === email);

    if (!identifiedUser || identifiedUser.password !== password) {
        throw new HttpError('Could not identify user, credentials seem to be wrong', 401);
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
