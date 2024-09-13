const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/login') {
        // const filePath = path.join(__dirname, 'login.html');
        fs.readFile("login.html", (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/html' });
                res.end('<h2>500 Internal Server Error</h2>');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }
        });
    } else if (req.method === 'POST' && req.url === '/login') {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            console.log('Received data:', body);

            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end('<h2>Login successful</h2>');
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h2>404 Not Found</h2>');
    }
});

server.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
