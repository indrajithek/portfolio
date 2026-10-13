import { QuartzComponent, QuartzComponentConstructor } from "./types"

// @ts-ignore
import script from "./scripts/yearDetails.inline"

export default (() => {
  const YearDetails: QuartzComponent = () => null

  YearDetails.afterDOMLoaded = script
  return YearDetails
}) satisfies QuartzComponentConstructor
