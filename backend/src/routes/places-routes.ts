import express from 'express';
import placeControllers from '../controllers/places-controllers';
import { check } from 'express-validator';
export const placesRouter = express.Router();

// const DUMMY_USERS = [
//     {
//         id: 'u1',
//         name: 'insu',
//         image: 'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcT4is8rP6vgN2j1gBkrHpjZepJvJisJcdS9c5qjIzkeMZusSlpdY0xIEplzTvQZtJQksvL5ljEvnrXDD1Hk_dTgSM4xis4RiDWx6H5Baz8',
//         places: 3,
//     },
// ];

placesRouter.get('/:pid', placeControllers.getPlaceByPlaceId);
placesRouter.patch(
    '/:pid',
    [check('title').not().isEmpty(), check('description').isLength({ min: 5 })],
    placeControllers.updatePlaceByPlaceId
);
placesRouter.delete('/:pid', placeControllers.deletePlaceByPlaceId);
placesRouter.post(
    '/',
    [check('title').not().isEmpty(), check('description').isLength({ min: 5 }), check('address').not().isEmpty()],
    placeControllers.createPlace as express.RequestHandler
);

placesRouter.get('/user/:uid', placeControllers.getPlacesByUserID);
