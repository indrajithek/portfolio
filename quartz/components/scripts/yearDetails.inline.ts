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
})
