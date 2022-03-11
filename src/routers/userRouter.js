import { Router } from 'express';

import { edit, remove, see, logout } from '../controllers/userController';

const userRouter = Router();

userRouter.get('/edit', edit);
userRouter.get('/remove', remove);
userRouter.get('/logout', logout);
userRouter.get('/:id', see);

export default userRouter;
