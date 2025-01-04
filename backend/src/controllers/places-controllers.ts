import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../models/http-error';
import { isFalsy } from '../util/insu-utils';
import { randomUUID } from 'node:crypto';
import { validationResult } from 'express-validator';
import getCoordsForAddress from '../util/location';
const DUMMY_PLACES = [
    {
        id: 'p1',
        title: 'Empire State Building',
        description: 'One of the most famous sky scrapers in the world!',
        location: {
            lat: 40.7484474,
            lng: -73.9871516,
        },
        address: '20 W 34th St, New York, NY 10001',
        creator: 'u1',
    },
    {
        id: 'p2',
        title: 'Empire State Building 2',
        description: 'One of the most famous sky scrapers in the world! 2',
        location: {
            lat: 40.7484474,
            lng: -73.9871516,
        },
        address: '20 W 34th St, New York, NY 10001 2',
        creator: 'u1',
    },
];

const getPlaceByPlaceId = (req: Request, res: Response, next: NextFunction) => {
    const placeId = req.params.pid;

    const place = DUMMY_PLACES.find((place) => place.id === placeId);

    if (!place) {
        // 에러처리 -> 직접처리, 다음 미들웨어가 처리하게 에러던지기나 next호출, db연결과 같은 비동기 동작이 있다면 무조건 next
        //
        // res.status(404).json({ message: 'Could not find a place for the provided place id.' }); // 직접 처리
        //
        // const appError = new AppError('Could not find a place for the provided place id.', 404); // 에러 던지기
        // throw appError;
        //
        const httpError = new HttpError('Could not find a place for the provided place id.', 404); // next로 에러 처리
        next(httpError);
    } else {
        res.json({ place });
    }
};

const getPlacesByUserID = (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.uid;

    const places = DUMMY_PLACES.filter((place) => place.creator === userId);

    if (places.length === 0) {
        // res.status(404).json({ message: 'Could not find a place for the provided user id.' });
        const httpError = new HttpError('Could not find a place for the provided user id.', 404);
        next(httpError);
    } else {
        res.json({ places });
    }
};

const createPlace = async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        return next(new HttpError('Invalid inputs passed, please check your data.', 400));
    }

    const { title, description, address, creator } = req.body;

    let coordinates: {
        lat: number;
        lng: number;
    };

    try {
        coordinates = await getCoordsForAddress(address);
    } catch (error) {
        return next(error);
    }

    if (isFalsy(title, description, coordinates, address, creator)) {
        next(new HttpError('생성할 수 없음', 400));
    } else {
        const newPlace = {
            id: randomUUID(),
            title,
            description,
            location: coordinates,
            address,
            creator,
        };

        DUMMY_PLACES.push(newPlace);

        res.status(201).json({ place: newPlace });
    }
};

const updatePlaceByPlaceId = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        throw new HttpError('Invalid inputs passed, please check your data.', 400);
    }

    const placeId = req.params.pid;
    const { title, description } = req.body;

    const indexOfPlace = DUMMY_PLACES.findIndex((place) => place.id === placeId);

    if (indexOfPlace === -1) {
        throw new HttpError('not found', 404);
    }
    if (isFalsy(title, description)) {
        throw new HttpError('Bad Request', 400);
    }

    const updatedPlace = {
        ...DUMMY_PLACES[indexOfPlace],
        title,
        description,
    };
    DUMMY_PLACES.splice(indexOfPlace, 1, updatedPlace);

    res.json({ place: updatedPlace });
};

const deletePlaceByPlaceId = (req: Request, res: Response, next: NextFunction) => {
    const placeId = req.params.pid;

    const indexOfPlace = DUMMY_PLACES.findIndex((place) => place.id === placeId);
    if (indexOfPlace === -1) {
        throw new HttpError('Could not find a place for that id.', 404);
    }

    DUMMY_PLACES.splice(indexOfPlace, 1);

    res.json({ message: 'Deleted place.' });
};

const placeControllers = {
    getPlaceByPlaceId,
    getPlacesByUserID,
    createPlace,
    updatePlaceByPlaceId,
    deletePlaceByPlaceId,
};
export default placeControllers;
