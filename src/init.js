import 'regenerator-runtime';
import 'dotenv/config';
import './db';
import './models/Video';
import './models/User';
import './models/Comment';
import app from './server';

const PORT = 4000;
app.listen(PORT, () => console.log(`✅ Server is running => http://localhost:${PORT} 🚀`));
