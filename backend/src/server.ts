import express from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { apiRouter } from './routes/api';
import { mySQLService } from './database/mysql';
import { dbManager } from './database/db';

// Load environment variables from .env if present
dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5000;

// Standard CORS Middleware
app.use((req, res, next) => {
  const origin = req.headers.origin || '*';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, Origin, X-Requested-With');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// Uploads Directories
const uploadsDir = path.join(process.cwd(), 'uploads');
const productsUploadsDir = path.join(uploadsDir, 'products');
const categoriesUploadsDir = path.join(uploadsDir, 'categories');
if (!fs.existsSync(productsUploadsDir)) fs.mkdirSync(productsUploadsDir, { recursive: true });
if (!fs.existsSync(categoriesUploadsDir)) fs.mkdirSync(categoriesUploadsDir, { recursive: true });

// Static Folders
app.use('/uploads', express.static(uploadsDir));
const publicDir = path.join(process.cwd(), 'public');
if (fs.existsSync(publicDir)) {
  app.use(express.static(publicDir));
}

// Request Parsers
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Health Check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'Lumina Backend REST API',
    version: '1.0.0',
    mysqlConnected: mySQLService.getIsConnected(),
    timestamp: new Date().toISOString()
  });
});

// Mount Main API Routes
app.use('/api', apiRouter);

// Global 404 Handler for API
app.all('/api/*', (_req, res) => {
  res.status(404).json({
    success: false,
    message: 'مسیر API مورد نظر یافت نشد.'
  });
});

// Global Error Handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[Server Error]', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

// Boot Server
async function start() {
  console.log('🚀 Starting Lumina Standalone Backend Server...');
  
  // Attempt MySQL connection and sync tables on startup
  try {
    const rawDb = dbManager.getRawDatabase();
    await mySQLService.init(rawDb);
  } catch (err) {
    console.warn('[MySQL Warning] Auto-init failed, local fallback database active:', err);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Lumina Backend REST API is running on http://0.0.0.0:${PORT}`);
    console.log(`📡 Health check available at: http://localhost:${PORT}/api/health`);
  });
}

start();
