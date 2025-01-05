import express from 'express';
import mongoDB from './mongo';
import mongoDBM from './mongoose';

const port = 5000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/products', mongoDBM.createProduct as express.RequestHandler);
app.get('/products', mongoDBM.getProducts as express.RequestHandler);

app.listen(port);
