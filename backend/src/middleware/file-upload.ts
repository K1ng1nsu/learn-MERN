import multer from 'multer';
import { randomUUID } from 'node:crypto';

const MIME_TYPE_MAP: Record<string, string> = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg',
};

export const fileUpload = multer({
    limits: { fileSize: 500_000 },
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'uploads/images');
        },
        filename: (req, file, cb) => {
            const ext = MIME_TYPE_MAP[file.mimetype];
            cb(null, randomUUID() + '.' + ext);
        },
    }),
    fileFilter: (req, file, cb) => {
        const isValid = !!MIME_TYPE_MAP[file.mimetype];
        if (!isValid) {
            return cb(new Error('Invalid mime type!'));
        }
        cb(null, true);
    },
});
