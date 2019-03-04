const http = require('http');

const hostname = 'localhost';
const port = '1234';

// Basic Server
http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain'});
    res.end('Hello World');
}).listen(port, hostname, () => {
    console.log(`Running on http://${hostname}:${port}`);
});

