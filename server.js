const express = require('express');
const app = express();
app.get('/', (_, res) => res.send('Hello from Node + Jenkins + Docker!'));
app.get('/healthz', (_, res) => res.send('ok'));
app.listen(3000, () => console.log('listening on 3000'));
