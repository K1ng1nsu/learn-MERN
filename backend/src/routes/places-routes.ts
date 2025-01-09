import express from 'express';
import placeControllers from '../controllers/places-controllers';
import { check } from 'express-validator';
import { fileUpload } from '../middleware/file-upload';
import { checkJwtToken } from '../middleware/check-auth';
export const placesRouter = express.Router();

placesRouter.get(
    '/:pid',
    //
    placeControllers.getPlaceByPlaceId
);
placesRouter.get(
    '/user/:uid',
    //
    placeControllers.getPlacesByUserID
);

// jwt token validator middleware
placesRouter.use(checkJwtToken);

// need auth
placesRouter.patch(
    '/:pid',
    [check('title').not().isEmpty(), check('description').isLength({ min: 5 })],
    placeControllers.updatePlaceByPlaceId
);

// need auth
placesRouter.delete(
    '/:pid',
    //
    placeControllers.deletePlaceByPlaceId
);

// need auth
placesRouter.post(
    '/',
    fileUpload.single('image'),
    [check('title').not().isEmpty(), check('description').isLength({ min: 5 }), check('address').not().isEmpty()],
    placeControllers.createPlace as express.RequestHandler
);
