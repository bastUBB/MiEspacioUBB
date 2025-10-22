import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectDB } from './config/configDb.js';
import { initializeMinIO } from './config/configMinio.js';
import { initialSetup } from './config/initialSetup.js';
import indexRoutes from './routes/index.routes.js';

const app = express();
const FRONTEND_URL = process.env.FRONTEND_URL || ['http://localhost:5173'];
const BACKEND_URL = process.env.BACKEND_URL || `http://localhost:5500`; 
const url = new URL(BACKEND_URL);

app.use(
  cors({
    credentials: true,
    origin: FRONTEND_URL
  })
);
app.use(express.json());
app.use(cookieParser()); 
app.use(express.urlencoded({ extended: false })); 
app.use("/api", indexRoutes); // Rutas de la API

// initialSetup()
//     .then(() => console.log('Initial setup completed'))
//     .catch(err => console.error('Error during initial setup:', err));

app.listen(url.port, async () => {
  try {
    await connectDB();
    await initializeMinIO();
    await initialSetup();
  } catch (error) {
    console.error('Error inicializando servicios:', error);
    process.exit(1);
  }
});