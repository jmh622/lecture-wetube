import { Router } from 'express';

import { join, login } from '../controllers/userController';
import { trending, search } from '../controllers/videoController';

const globalRouter = Router();

globalRouter.get('/', trending);
globalRouter.get('/join', join);
globalRouter.get('/login', login);
globalRouter.get('/search', search);

export default globalRouter;
