import {header, section, div, h1, ul, li, a, form, fieldset, label, input, button} from "@cycle/dom"

const entry = (article) => li(
  a({ props: { href: article.url, target: '_blank' } }, article.title)
)

const buildSearchForm = () => {
  return form(
    '#search-form',
    { props: { action: "", method: "GET" } },
    [
      label("search articles"),
      input({ props: { name: "q", type: "text", value: "engineering" } }),
      button({ props: { type: "submit" } }, "search")
    ]
  )
}

export default function build(articles) {
  return div([
    header(buildSearchForm()),
    section([
      h1("Articles"),
      ul(articles.map(entry))
    ])
  ])
}
