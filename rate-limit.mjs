import Rx from 'rxjs';

export const rateLimit = (stream_, delayMs) => {
  const out_ = new Rx.Subject()
  var nextTimestamp = +(new Date())
  var hasEvents = 0;
  const started = nextTimestamp

  function onEvent(e) {
    var now = +(new Date())
    console.log('now', now - started, 'next', nextTimestamp - started)

    if (now > nextTimestamp) {
      nextTimestamp = now + delayMs
      console.log('now %d set next timestamp at',
        now - started, nextTimestamp - started)
      out_.next(e)
      return
    }

    // delay the response
    const sleepMs = nextTimestamp - now;
    console.log('need to sleep for %d ms at', sleepMs, now - started)
    nextTimestamp += delayMs
    hasEvents += 1

    setTimeout(function () {
      console.log('sending', e, 'at', +(new Date()) - started)
      out_.next(e)
      hasEvents -= 1
      if (!hasEvents) {
        out_.complete()
      }
    }, sleepMs)
  }

  stream_.subscribe(
    onEvent,
    out_.onError
  )

  return out_
};
