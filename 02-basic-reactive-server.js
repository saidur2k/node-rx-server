const Rx = require('rxjs');
const requests$ = new Rx.Subject();

function sendHello(e) {
  console.log('sending hello');
  e.res.writeHead(200, { 'Content-Type': 'text/plain' });
  e.res.end('Hello World\n');
}

requests$

  .subscribe(sendHello);

  const http = require('http');
  const hostname = '127.0.0.1';
  const port = 1337;
  http.createServer((req, res) => {
    requests$
    .next({ req, res });
  }).listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
  });