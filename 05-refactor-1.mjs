import Rx from 'rxjs';
import http from 'http';
import 'rxjs/add/operator/do';

const requests$ = new Rx.Subject();

function main() {
  return requests$
    .do(e => console.log('request to', e.req.url))
}

function httpEffect(model$) {
  model$.subscribe(e => {
    console.log('sending hello')
    e.res.writeHead(200, { 'Content-Type': 'text/plain' })
    e.res.end('Hello World\n')
  })
}

const sink = main()
httpEffect(sink)

const hostname = '127.0.0.1'
const port = 1337

http.createServer((req, res) => {
  requests$.next({ req, res })
}).listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`)
});