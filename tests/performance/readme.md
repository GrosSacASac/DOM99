# Performance

Here are some tests for performance.

Eventually before committing any change, a check will be made to see if the new version is as fast or faster than the previous one.

## Ongoing explorations

### Event delegation

Having 2 buttons inside a div, it is possible to attach 1 event listener to the div, instead of the 2 buttons and have the same functionality. When the div event triggers we can distinguish if which one button was pressed

Problems: The removal of the button and reinsertion have to be in sync with the div's event listener. It does not work all events (which ones ?)

see perf-event-responsible.html

## Links

https://github.com/krausest/js-framework-benchmark
