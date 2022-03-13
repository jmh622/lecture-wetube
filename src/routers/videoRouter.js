import { Router } from 'express';

import { getUpload, getEdit, postEdit, deleteVideo, watch, postUpload } from '../controllers/videoController';

const videoRouter = Router();

videoRouter.get('/:id([0-9a-z]{24})', watch);
videoRouter.route('/upload').get(getUpload).post(postUpload);
videoRouter.route('/:id([0-9a-z]{24})/edit').get(getEdit).post(postEdit);
videoRouter.get('/:id([0-9a-z]{24})/delete', deleteVideo);

export default videoRouter;
