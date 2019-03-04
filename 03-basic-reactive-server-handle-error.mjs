import Rx from 'rxjs';
import { tap } from 'rxjs/operators';
import http from 'http';

const requests$ = new Rx.Subject();

function sendHello(e) {
  console.log('sending hello');
  e.res.writeHead(200, { 'Content-Type': 'text/plain' });
  e.res.end('Hello World\n');
}

// handle any errors in the stream
const subscription = requests$.pipe(
  tap(e => console.log('request to', e.req.url)),
).subscribe(
  sendHello,
  console.error,
  () => {
      console.log('stream is done')
      // nicely frees the stream
      subscription.dispose()
  }
);

process.on('exit', () => subscription.dispose());

  const hostname = '127.0.0.1';
  const port = 1337;
  http.createServer((req, res) => {
    requests$.next({ req, res });
  }).listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
  });