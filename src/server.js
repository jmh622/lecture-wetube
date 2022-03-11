import express from 'express';
import morgan from 'morgan';

import globalRouter from './routers/globalRouter';
import userRouter from './routers/userRouter';
import videoRouter from './routers/videoRouter';

const app = express();

app.set('view engine', 'pug');
app.set('views', process.cwd() + '/src/views');

app.use(morgan('dev'));

app.use('/', globalRouter);
app.use('/users', userRouter);
app.use('/videos', videoRouter);

const PORT = 4000;
app.listen(PORT, () => console.log(`✅ Server is running => http://localhost:${PORT} 🚀`));
