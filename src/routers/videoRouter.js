import { Router } from 'express';

import { getUpload, getEdit, postEdit, deleteVideo, watch, postUpload } from '../controllers/videoController';
import { protectorMiddleware, uploadVideoMiddleware } from '../middlewares';

const videoRouter = Router();

videoRouter.get('/:id([0-9a-z]{24})', watch);
videoRouter.route('/upload').all(protectorMiddleware).get(getUpload).post(uploadVideoMiddleware, postUpload);
videoRouter.route('/:id([0-9a-z]{24})/edit').all(protectorMiddleware).get(getEdit).post(postEdit);
videoRouter.get('/:id([0-9a-z]{24})/delete', protectorMiddleware, deleteVideo);

export default videoRouter;
