import express from 'express';
import morgan from 'morgan';

const app = express();

const privateMiddleware = (req, res, next) => {
  const url = req.url;
  if (url === '/protected') {
    console.log('Not allowed!!!');
    return res.send('<h1>Not Allowed</h1>');
  }
  console.log('Allowed, you may continue.');
  next();
};

const handleHome = (req, res) => res.json({ message: 'hi!' });
const handleProtected = (req, res) => res.send('Welcome to the private lounge.');

app.use(morgan('dev'));
app.use(privateMiddleware);

app.get('/', handleHome);
app.get('/protected', handleProtected);

const PORT = 4000;
app.listen(PORT, () => console.log(`✅ Server is running => http://localhost:${PORT} 🚀`));
