const express = require('express');
const { retrieveRelevant } = require('./rag.cjs');
const path = require('path');

const app = express();
app.use(express.json());

const DOCS_DIR = path.join(__dirname, '../../');

app.post('/rag/query', (req, res) => {
  const { query } = req.body;
  if (!query) return res.status(400).json({ error: 'Missing query' });
  const results = retrieveRelevant(query, DOCS_DIR);
  res.json({ results });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`RAG API server running on port ${PORT}`);
});
