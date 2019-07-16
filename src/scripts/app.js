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

// the URL for our feed list, prepended to all requests
const feedURL = "https://codingthat-quick-json-back-end-2.glitch.me/posts"

/**
 * The main `run` function.
 * @param {Object} sources a collection of source streams
 * @param {Stream} sources.DOM the source stream provided by the DOM driver
 * @param {Stream} sources.HTTP the source stream provided by the HTTP driver
 * @param {Stream} sources.ONION the source stream provided by the onion driver
 * @return {Object} a collection of sink streams
 */
function main(sources) {
  const { DOM, HTTP, LOG } = sources
  // start our request stream with a default query of "engineering"
  // label the responses "query result"
  const request$ = xs
    .create()
    .startWith({ url: feedURL + "?q=engineering", category: "query result" })
  const response$ = HTTP
    .select("query result")
    .flatten()
    .startWith({ body: [] })

  // buildDom will handle updating the dom with the query responses
  const vdom$ = response$.map(res => buildDom(res.body))

  // let's log all requests and responses to console
  const log$ = xs.merge(
    request$.map(req => ({ type: 'query', content: req })),
    response$.map(res => ({ type: 'response', content: res.body }))
  )

  // return the collection of sinks
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
