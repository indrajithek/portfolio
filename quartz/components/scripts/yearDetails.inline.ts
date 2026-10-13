// year dropdowns (e.g. <summary>2024</summary>): keep only the last 3 years open,
// based on the visitor's current date so nothing has to be updated each year
const OPEN_YEARS = 3

// show the number of list entries next to each year and each section heading,
// e.g. "2024 (3 entries)" and "Invited Talks and Presentations 35 entries over the last 7 years",
// counted on every page load
function entries(n: number) {
  return n === 1 ? "1 entry" : `${n} entries`
}

function setCount(summary: HTMLElement, text: string, section = false) {
  let badge = summary.querySelector(":scope > .item-count")
  if (!badge) {
    badge = document.createElement("span")
    badge.className = section ? "item-count section-count" : "item-count"
    summary.appendChild(badge)
  }
  badge.textContent = text
}

// sections with an id (e.g. <details open id="InvitedTalksandPresentations">) can be linked to
// directly as /#InvitedTalksandPresentations; a link icon next to the heading copies that url
const svgLink =
  '<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>'
const svgCheck =
  '<svg aria-hidden="true" width="18" height="18" viewBox="0 0 16 16"><path fill-rule="evenodd" fill="rgb(63, 185, 80)" d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"></path></svg>'

function addSectionLink(details: HTMLDetailsElement) {
  const summary = details.querySelector(":scope > summary") as HTMLElement | null
  if (!summary || summary.querySelector(":scope > .section-link")) return
  const id = details.id
  const link = document.createElement("a")
  link.className = "section-link"
  link.href = `#${id}`
  link.title = "Copy link to this section"
  link.ariaLabel = `Copy link to ${summaryLabel(summary)}`
  link.dataset.routerIgnore = ""
  link.dataset.noPopover = ""
  link.innerHTML = svgLink
  function onClick(e: MouseEvent) {
    // don't toggle the dropdown or jump the page, just copy the url
    e.preventDefault()
    e.stopPropagation()
    const url = `${location.origin}${location.pathname}#${id}`
    history.replaceState(history.state, "", url)
    navigator.clipboard?.writeText(url).then(
      () => {
        link.innerHTML = svgCheck
        setTimeout(() => (link.innerHTML = svgLink), 2000)
      },
      (error) => console.error(error),
    )
  }
  link.addEventListener("click", onClick)
  window.addCleanup(() => link.removeEventListener("click", onClick))
  summary.appendChild(link)
}

// opening the year dropdowns above a linked section pushes it down after the browser has
// already scrolled to it, so scroll to it again once the dropdowns are set
function scrollToHash() {
  if (!location.hash) return
  const target = document.getElementById(decodeURIComponent(location.hash.substring(1)))
  if (!target?.closest("article")) return
  for (let d = target.closest("details"); d; d = d.parentElement?.closest("details") ?? null) {
    d.open = true
  }
  target.scrollIntoView()
}

function summaryLabel(summary: HTMLElement | null) {
  if (!summary) return ""
  const clone = summary.cloneNode(true) as HTMLElement
  clone.querySelector(":scope > .item-count")?.remove()
  return clone.textContent?.trim() ?? ""
}

document.addEventListener("nav", () => {
  const cutoff = new Date().getFullYear() - (OPEN_YEARS - 1)
  const allDetails = document.querySelectorAll("article details") as NodeListOf<HTMLDetailsElement>
  const yearCounts = new Map<HTMLDetailsElement, number>()

  allDetails.forEach((details) => {
    const summary = details.querySelector(":scope > summary") as HTMLElement | null
    const year = summaryLabel(summary)
    if (summary && /^\d{4}$/.test(year)) {
      details.open = Number(year) >= cutoff
      const count = details.querySelectorAll(":scope > ul > li, :scope > ol > li").length
      yearCounts.set(details, count)
      setCount(summary, ` (${entries(count)})`)
    }
  })

  // section totals: sum of the year dropdowns directly inside each section,
  // over the years from the earliest year in that section up to the current year
  const currentYear = new Date().getFullYear()
  allDetails.forEach((details) => {
    if (yearCounts.has(details)) return
    const summary = details.querySelector(":scope > summary") as HTMLElement | null
    const years = details.querySelectorAll(":scope > details") as NodeListOf<HTMLDetailsElement>
    const yearChildren = Array.from(years).filter((d) => yearCounts.has(d))
    if (summary && yearChildren.length > 0) {
      const total = yearChildren.reduce((sum, d) => sum + yearCounts.get(d)!, 0)
      const earliest = Math.min(
        ...yearChildren.map((d) => Number(summaryLabel(d.querySelector(":scope > summary")))),
      )
      const span = Math.max(1, currentYear - earliest + 1)
      const period = span === 1 ? "this year" : `over the last ${span} years`
      setCount(summary, ` ${entries(total)} ${period}`, true)
    }
  })

  document
    .querySelectorAll("article details[id]")
    .forEach((details) => addSectionLink(details as HTMLDetailsElement))

  scrollToHash()
  // images above (e.g. the profile photo) can still shift the page while loading,
  // so scroll once more when they're done unless the visitor has started scrolling
  if (location.hash && document.readyState !== "complete") {
    const userEvents = ["wheel", "touchmove", "keydown", "mousedown"]
    const cancel = () => {
      window.removeEventListener("load", onLoad)
      userEvents.forEach((ev) => window.removeEventListener(ev, cancel))
    }
    const onLoad = () => {
      cancel()
      scrollToHash()
    }
    window.addEventListener("load", onLoad)
    userEvents.forEach((ev) => window.addEventListener(ev, cancel, { passive: true }))
    window.addCleanup(cancel)
  }
})
