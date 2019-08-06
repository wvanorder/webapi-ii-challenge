const express = require('express');

const postsRouter = require('./posts/posts-router.js');

const Hubs = require('./data/db.js');

const server = express();
server.use(express.json());





server.use('/api/posts', postsRouter);












server.listen(8000, () => console.log('\nAPI Running\n'));