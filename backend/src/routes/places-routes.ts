import express from 'express';
import placeControllers from '../controllers/places-controllers';
import { check } from 'express-validator';
import { fileUpload } from '../middleware/file-upload';
export const placesRouter = express.Router();

placesRouter.get(
    '/:pid',
    //
    placeControllers.getPlaceByPlaceId
);

placesRouter.patch(
    '/:pid',
    [check('title').not().isEmpty(), check('description').isLength({ min: 5 })],
    placeControllers.updatePlaceByPlaceId
);

placesRouter.delete(
    '/:pid',
    //
    placeControllers.deletePlaceByPlaceId
);

placesRouter.post(
    '/',
    fileUpload.single('image'),
    [check('title').not().isEmpty(), check('description').isLength({ min: 5 }), check('address').not().isEmpty()],
    placeControllers.createPlace as express.RequestHandler
);

placesRouter.get(
    '/user/:uid',
    //
    placeControllers.getPlacesByUserID
);
