import { Router } from 'express';

import {
  getEdit,
  postEdit,
  remove,
  see,
  logout,
  startGithubLogin,
  finishGithubLogin,
  getChangePassword,
  postChangePassword,
} from '../controllers/userController';
import { protectorMiddleware, publicOnlyMiddleware, uploadAvatarMiddleware } from '../middlewares';

const userRouter = Router();

userRouter.route('/edit').all(protectorMiddleware).get(getEdit).post(uploadAvatarMiddleware, postEdit);
userRouter.route('/change-password').all(protectorMiddleware).get(getChangePassword).post(postChangePassword);
userRouter.get('/remove', remove);
userRouter.get('/logout', protectorMiddleware, logout);
userRouter.get('/github/start', publicOnlyMiddleware, startGithubLogin);
userRouter.get('/github/finish', publicOnlyMiddleware, finishGithubLogin);
userRouter.get('/:id', see);

export default userRouter;
