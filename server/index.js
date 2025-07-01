import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import authRoutes from './routes/auth.js';
import guidanceRoutes from './routes/guidance.js';
import { checkRagHealth } from './services/ragService.js';

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes  
app.use('/api/auth', authRoutes);
app.use('/api/guidance', guidanceRoutes);

// Health check with RAG status
app.get('/api/health', async (req, res) => {
  const ragStatus = await checkRagHealth();
  
  res.json({ 
    message: 'Digital Temple API is running',
    timestamp: new Date().toISOString(),
    rag_server: ragStatus,
    node_env: process.env.NODE_ENV || 'development',
    mongodb: 'connected'
  });
});

// RAG system status endpoint
app.get('/api/rag-status', async (req, res) => {
  const ragStatus = await checkRagHealth();
  res.json(ragStatus);
});

app.listen(PORT, () => {
  console.log(`🏛️  Digital Temple server running on port ${PORT}`);
  console.log(`📚 RAG server expected at: ${process.env.RAG_SERVER_URL || 'http://localhost:5000'}`);
});