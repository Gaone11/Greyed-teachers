const { indexDocuments } = require('./rag');
const path = require('path');

const DOCS_DIR = path.join(__dirname, '../../');
indexDocuments(DOCS_DIR);
console.log('Indexed documents in', DOCS_DIR);
