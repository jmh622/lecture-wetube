import { Router } from 'express';

import { getUpload, getEdit, postEdit, deleteVideo, watch, postUpload } from '../controllers/videoController';

const videoRouter = Router();

videoRouter.route('/upload').get(getUpload).post(postUpload);
videoRouter.get('/:id', watch);
videoRouter.route('/:id/edit').get(getEdit).post(postEdit);
videoRouter.get('/:id/delete', deleteVideo);

export default videoRouter;
