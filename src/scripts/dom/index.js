import {header, footer, article, span, div, a, form, input, button} from "@cycle/dom"
import logo from "../../assets/cyclejs_logo.svg"

const entry = (article) => a(".post-list-item", { props: { href: article.url, target: '_blank' } }, article.title)

const buildSearchForm = (fetching) => {
  return form(
    '#search-form.search-form',
    { props: { action: "", method: "GET" } },
    [
      input(".search-input", {
        props: {
          name: "q",
          type: "text",
          placeholder: "engineering",
          disabled: fetching
        },
        on: { focus: function () { this.select(); console.log('click'); } } 
      }),
      button(".search-btn", { props: { type: "submit", disabled: fetching } }, fetching ? "searching..." : "search")
    ]
  )
}

export default function build(articles, fetching) {
  return div("#app.layout", [
    header(".app-header", 
      div(".layout-container",
        div(".app-header-content", [
          div(".header-image", logo),
          buildSearchForm(fetching),
        ]),
      ),
    ),
    div(".layout-container", [
      article(".app-main",
        div(".post-list", articles ? articles.length ? articles.map(entry) : span(".post-list-item", "No results :(") : "" )
      ),
      footer(".app-footer", [
        "made with ",
        a({ props: { href: "https://cycle.js.org", target: "_blank" } }, "Cycle.js"),
        ". Check out the source on ",
        a({ props: { href: "https://github.com/nphyx/framework-comparison-article-cycle-js", target: "_blank" } }, "Github"),
        "!",
      ])
    ]),
  ])
}
