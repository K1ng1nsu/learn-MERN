import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import mongoose from 'mongoose';
import fs from 'fs';
// my util
import getCoordsForAddress from '../util/location';
//model
import { HttpError } from '../models/http-error';
import Place, { PlaceType } from '../models/Place';
import User, { UserType } from '../models/User';

const getPlaceByPlaceId = async (req: Request, res: Response, next: NextFunction) => {
    const placeId = req.params.pid;

    let place;
    try {
        place = await Place.findById(placeId);
    } catch (err) {
        const error = new HttpError('Could not fetching place, Please try again', 500);
        return next(error);
    }

    if (!place) {
        // 에러처리 -> 직접처리, 다음 미들웨어가 처리하게 에러던지기나 next호출, db연결과 같은 비동기 동작이 있다면 무조건 next
        //
        // res.status(404).json({ message: 'Could not find a place for the provided place id.' }); // 직접 처리
        //
        // const appError = new AppError('Could not find a place for the provided place id.', 404); // 에러 던지기
        // throw appError;
        //
        const httpError = new HttpError('Could not find a place for the provided place id.', 404); // next로 에러 처리
        return next(httpError);
    } else {
        res.json({ place: place.toObject({ getters: true }) });
    }
};

const getPlacesByUserID = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.uid;

    let userWithPlaces;
    try {
        userWithPlaces = await User.findById(userId).populate<{ places: PlaceType[] }>('places');
    } catch (err) {
        return next(new HttpError('Something went wrong. Could not find place', 500));
    }

    if (!userWithPlaces || userWithPlaces.places.length === 0) {
        const httpError = new HttpError('Could not find a place for the provided user id.', 404);
        return next(httpError);
    } else {
        res.json({ places: userWithPlaces.places.map((place) => place.toObject({ getters: true })) });
    }
};

const createPlace = async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs passed, please check your data.', 400));
    }

    const { title, description, address } = req.body;

    const creator = req.userData?.userId;

    let coordinates: {
        lat: number;
        lng: number;
    };

    try {
        coordinates = await getCoordsForAddress(address);
    } catch (error) {
        return next(error);
    }

    const newPlace = new Place({
        title,
        description,
        location: coordinates,
        address,
        image: req.file?.path,
        creator,
    });

    let user;
    try {
        user = await User.findById(creator);
        if (!user) {
            return next(new HttpError('Could not find user for provieded id', 404));
        }
    } catch (err) {
        return next(new HttpError('Creating place failed, please try again-1', 500));
    }

    try {
        // transaction --> session 필요함
        // transaction의 경우 컬렉션이 이미 만들어져 있어야 한다고 함 --> 그 동안에는  places, users 같은 컬렉션이 저절로 만들어졌음
        const session = await mongoose.startSession();
        session.startTransaction();

        await newPlace.save({ session });
        user.places.push(newPlace as any);
        await user.save({ session });

        await session.commitTransaction();
    } catch (err) {
        console.log(err);

        const error = new HttpError('Creating place failed, please try again-2', 500);
        return next(error);
    }

    res.status(201).json({ place: newPlace });
};

const updatePlaceByPlaceId = async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        next(new HttpError('Invalid inputs passed, please check your data.', 400));
    }

    const placeId = req.params.pid;
    const { title, description } = req.body;

    const userId = req.userData?.userId;

    let updatedPlace;
    try {
        updatedPlace = await Place.findById(placeId);

        if (!updatedPlace) {
            return next(new HttpError('Somethin went wrong, please try again -1', 500));
        }

        if (updatedPlace.creator.id.toString() !== userId) {
            return next(new HttpError('Somethin went wrong, please try again -2', 500));
        }
        updatedPlace.title = title;
        updatedPlace.description = description;
        await updatedPlace.save();
    } catch (err) {
        return next(new HttpError('Somethin went wrong, please try again -3', 500));
    }

    res.json({ place: { creator: userId } });
};

const deletePlaceByPlaceId = async (req: Request, res: Response, next: NextFunction) => {
    const placeId = req.params.pid;

    const userId = req.userData?.userId;

    let place;
    try {
        place = await Place.findById(placeId).populate<{ creator: UserType }>('creator');
    } catch (err) {
        return next(new HttpError('Something went wrong, could not delete place - 1', 500));
    }

    if (!place) {
        return next(new HttpError('Could not find place', 404));
    }

    if (place.creator.id !== userId!) {
        return next(new HttpError('Something went wrong, could not delete place - 2', 500));
    }

    const imagePath = place.image;

    try {
        const session = await mongoose.startSession();
        session.startTransaction();

        await place.deleteOne({ session });
        await place.creator.updateOne({ $pull: { places: place._id } }, { session });

        await session.commitTransaction();

        fs.unlink(imagePath, (err) => {
            console.log(err);
        });

        res.json({ message: 'Deleted place.' });
    } catch (err) {
        console.log(err);

        return next(new HttpError('Something went wrong, could not delete place', 500));
    }
};

const placeControllers = {
    getPlaceByPlaceId,
    getPlacesByUserID,
    createPlace,
    updatePlaceByPlaceId,
    deletePlaceByPlaceId,
};
export default placeControllers;
