import {section, h1, ul, li, a} from "@cycle/dom"

const entry = (article) => li(
  a({props:{href:article.url}}, article.title)
)

export default function build(articles) {
  return section([
    h1("Articles"),
    ul(articles.map(entry))
  ])
}
