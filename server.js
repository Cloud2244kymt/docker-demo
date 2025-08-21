// server.js
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// serve static assets from /public
app.use(express.static(path.join(__dirname, 'public')));

// health for CI
app.get('/healthz', (_req, res) => res.type('text/plain').send('ok'));

// root -> pretty UI
app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
