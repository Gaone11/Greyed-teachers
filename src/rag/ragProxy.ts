// src/rag/ragProxy.ts
import express from 'express';
import axios from 'axios';

const router = express.Router();

// Proxy endpoint for RAG queries
router.post('/rag/query', async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) return res.status(400).json({ error: 'Missing query' });
    // Forward the request to the local RAG API
    const response = await axios.post('http://localhost:3001/rag/query', { query });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'RAG proxy error', details: error.message });
  }
});

export default router;
