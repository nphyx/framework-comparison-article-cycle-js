// the core of a Cycle.js app, run handles hooking up our sources and sinks
import {run} from "@cycle/run"
// Cycle supports several popular streaming libraries, but we'll use xstream, which was
// made specifically for Cycle
import xs from "xstream"
// Cycle's official vdom driver is based on snabbdom
import {makeDOMDriver, DOMSource} from "@cycle/dom"
// cycle's HTTP driver handles asynchronous HTTP requests
// it takes a sink stream of requests and provides a source stream of responses
import {makeHTTPDriver, HTTPSource} from "@cycle/http"
// this is a barebones driver logging to console
import {makeLogDriver} from "./drivers/log"
// top level vdom
import buildDom from "./dom/index"

/**
 * Create a request object from a query string taken from the search form input.
 * @param {string} queryString
 * @return {Object}
 */
const queryToRequest = (queryString) => ({
  url: "https://codingthat-quick-json-back-end-2.glitch.me/posts" + "?q=" + queryString,
  category: "query result"
})

/**
 * The main `run` function.
 * @param {Object} sources a collection of source streams
 * @param {Stream} sources.DOM the source stream provided by the DOM driver
 * @param {Stream} sources.HTTP the source stream provided by the HTTP driver
 * @return {Object} a collection of sink streams
 */
function main(sources) {
  const { DOM, HTTP } = sources

  // we'll select submit events from the search form, pull out the query string, and
  // map it to the query object that the HTTP driver expects
  const request$ = DOM
    // DOM emits a stream of all our elements, we'll filter out everything but
    // the search form
    .select('#search-form')
    // we only care about form submit events, so let's get a stream of those
    .events('submit', { preventDefault: true })
    // pull out the value of the 'q' input, resulting in a stream of query strings
    .map(ev => new FormData(ev.target).get('q'))
    // we want to send an initial request for "engineering" articles, so start with that
    .startWith("engineering")
    // finally, map the stream of strings to a stream of request objects
    .map(queryToRequest)

  // the HTTP driver emits a stream of responses. We labeled our queries as
  // 'query result' in the queryToRequest function, let's pull out the corresponding
  // responses here
  const response$ = HTTP
    .select("query result")
    // HTTP.select gives us a stream of streams, let's flatten that into a single stream
    .flatten()
    // since we're connecting the response$ directly to the vdom$, it needs an initial
    // value. in a more complete app we'd have a state driver to manage data but this
    // is fine for now.
    .startWith({ body: [] })

  // buildDom will handle updating the dom with the query responses
  const vdom$ = response$.map(res => buildDom(res.body))

  // let's log all requests and responses to console
  const log$ = xs.merge(
    request$.map(req => ({ type: 'query', content: req })),
    response$.map(res => ({ type: 'response', content: res.body }))
  )

  // the collection of sinks
  return {LOG: log$, DOM: vdom$, HTTP: request$}
}

// set up sources
const sources = {
  // the dom driver accepts a selector for the container element
  DOM: makeDOMDriver("body"),
  HTTP: makeHTTPDriver(),
  LOG: makeLogDriver()
}

run (main, sources)
