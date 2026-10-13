import { QuartzComponent, QuartzComponentConstructor } from "./types"

// @ts-ignore
import script from "./scripts/yearDetails.inline"

export default (() => {
  const YearDetails: QuartzComponent = () => null

  YearDetails.afterDOMLoaded = script
  YearDetails.css = `
  article summary > .item-count {
    color: var(--gray);
    font-weight: normal;
  }
  article summary > .section-count {
    font-size: 0.6em;
    margin-left: 0.3em;
  }
  `
  return YearDetails
}) satisfies QuartzComponentConstructor
