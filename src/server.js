import express from 'express';
import session from 'express-session';
import morgan from 'morgan';

import rootRouter from './routers/rootRouter';
import userRouter from './routers/userRouter';
import videoRouter from './routers/videoRouter';

const app = express();

app.set('view engine', 'pug');
app.set('views', process.cwd() + '/src/views');

app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(session({ secret: 'muho', resave: true, saveUninitialized: true }));

app.use('/', rootRouter);
app.use('/users', userRouter);
app.use('/videos', videoRouter);

export default app;
