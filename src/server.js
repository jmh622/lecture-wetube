import express from 'express';
import session from 'express-session';
import sessionStore from 'connect-mongo';
import morgan from 'morgan';
import { localsMiddleware } from './middlewares';

import rootRouter from './routers/rootRouter';
import userRouter from './routers/userRouter';
import videoRouter from './routers/videoRouter';

const app = express();

app.set('view engine', 'pug');
app.set('views', process.cwd() + '/src/views');

app.use('/uploads', express.static('uploads'));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore.create({ mongoUrl: process.env.DB_URL }),
  })
);

app.use(localsMiddleware);

app.use('/', rootRouter);
app.use('/users', userRouter);
app.use('/videos', videoRouter);

export default app;
