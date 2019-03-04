import Rx from 'rxjs';
import http from 'http';
import * as operators from 'rxjs/operators';

import { rateLimit } from './rate-limit.mjs';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/timeInterval';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/do';
const started = +(new Date())
function sendHello(e) {
    console.log('sending hello');
    e.res.writeHead(200, { 'Content-Type': 'text/plain' });
    e.res.end('Hello World\n');
  }

const requests$ = new Rx.Subject();

// ---r1-r2-r3-----r4--------r5---->    // requests_
//      rateLimit
// ---r1---r2---r3---r4------r5---->    // rateLimited_ = rateLimit(requests_)
//    |    |    |    |    |             // 1 second intervals

const in_  = Rx.Observable
    .interval(200)
    .take(5);
const interval = 1000
const limited_ = rateLimit(
    requests$.do(e => console.log(`request to ${e.req.url} at`, +(new Date) - started))
, interval);

limited_.subscribe(sendHello)

process.on('exit', () => limited_.dispose());

  const hostname = '127.0.0.1';
  const port = 1337;
  http.createServer((req, res) => {
    requests$.next({ req, res });
  }).listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
  });