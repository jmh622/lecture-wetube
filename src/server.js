import express from 'express';
import morgan from 'morgan';

import globalRouter from './routers/globalRouter';
import userRouter from './routers/userRouter';
import videoRouter from './routers/videoRouter';

const app = express();

app.use(morgan('dev'));

app.use('/', globalRouter);
app.use('/users', userRouter);
app.use('/videos', videoRouter);

const PORT = 4000;
app.listen(PORT, () => console.log(`✅ Server is running => http://localhost:${PORT} 🚀`));
