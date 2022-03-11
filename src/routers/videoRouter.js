import { Router } from 'express';

import { upload, edit, deleteVideo, see } from '../controllers/videoController';

const videoRouter = Router();

videoRouter.get('/upload', upload);
videoRouter.get('/:id', see);
videoRouter.get('/:id/edit', edit);
videoRouter.get('/:id/delete', deleteVideo);

export default videoRouter;
