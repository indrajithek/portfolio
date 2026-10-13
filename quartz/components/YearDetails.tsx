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
  article details[id] {
    scroll-margin-top: 1rem;
  }
  article summary > .section-link {
    display: inline-flex;
    vertical-align: middle;
    margin-left: 0.5rem;
    color: var(--gray);
    background-color: transparent;
    opacity: 0;
    transition: opacity 0.2s ease;
  }
  article summary > .section-link > svg {
    width: 18px;
    height: 18px;
  }
  article summary:hover > .section-link,
  article summary > .section-link:focus-visible {
    opacity: 1;
  }
  article summary > .section-link:hover {
    color: var(--secondary);
  }
  @media (hover: none) {
    article summary > .section-link {
      opacity: 0.6;
    }
  }
  `
  return YearDetails
}) satisfies QuartzComponentConstructor
