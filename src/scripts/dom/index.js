import {header, h1, p} from "@cycle/dom"

export default function build(state) {
  return header([
    h1("Hello, World"),
    p(state.bodyText)
  ])
}
