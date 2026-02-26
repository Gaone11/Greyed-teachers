var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var fs = require('fs');
var path = require('path');
var encode = require('gpt-3-encoder').encode;
// Simple cosine similarity
function cosineSimilarity(a, b) {
    var dot = a.reduce(function (sum, ai, i) { return sum + ai * b[i]; }, 0);
    var normA = Math.sqrt(a.reduce(function (sum, ai) { return sum + ai * ai; }, 0));
    var normB = Math.sqrt(b.reduce(function (sum, bi) { return sum + bi * bi; }, 0));
    return dot / (normA * normB);
}
// Dummy embedding function (replace with real model or API)
function embed(text) {
    // For demo: use token count as a simple embedding
    var tokens = encode(text);
    return [tokens.length];
}
// Split document into chunks
function chunkText(text, maxTokens) {
    if (maxTokens === void 0) { maxTokens = 200; }
    var sentences = text.split(/(?<=[.!?])\s+/);
    var chunks = [];
    var current = '';
    for (var _i = 0, sentences_1 = sentences; _i < sentences_1.length; _i++) {
        var sentence = sentences_1[_i];
        if (encode(current + sentence).length > maxTokens) {
            if (current)
                chunks.push(current);
            current = sentence;
        }
        else {
            current += (current ? ' ' : '') + sentence;
        }
    }
    if (current)
        chunks.push(current);
    return chunks;
}
// Index all markdown files in docsDir
function indexDocuments(docsDir) {
    var files = fs.readdirSync(docsDir).filter(function (f) { return f.endsWith('.md'); });
    var index = [];
    for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
        var file = files_1[_i];
        var text = fs.readFileSync(path.join(docsDir, file), 'utf-8');
        var chunks = chunkText(text);
        for (var _a = 0, chunks_1 = chunks; _a < chunks_1.length; _a++) {
            var chunk = chunks_1[_a];
            index.push({ chunk: chunk, embedding: embed(chunk), file: file });
        }
    }
    fs.writeFileSync(path.join(docsDir, 'rag_index.json'), JSON.stringify(index, null, 2));
}
function retrieveRelevant(query, docsDir, topN) {
    if (topN === void 0) { topN = 3; }
    var index = JSON.parse(fs.readFileSync(path.join(docsDir, 'rag_index.json'), 'utf-8'));
    var queryEmbedding = embed(query);
    return index
        .map(function (item) { return (__assign(__assign({}, item), { score: cosineSimilarity(item.embedding, queryEmbedding) })); })
        .sort(function (a, b) { return b.score - a.score; })
        .slice(0, topN);
}
module.exports = { indexDocuments: indexDocuments, retrieveRelevant: retrieveRelevant };
