const http = require('http');
const userRoutes = require('../routes/route');

const server = http.createServer((req, res) => {
  userRoutes(req, res);
});

module.exports = server;
