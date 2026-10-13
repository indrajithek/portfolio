// year dropdowns (e.g. <summary>2024</summary>): keep only the last 3 years open,
// based on the visitor's current date so nothing has to be updated each year
const OPEN_YEARS = 3

document.addEventListener("nav", () => {
  const cutoff = new Date().getFullYear() - (OPEN_YEARS - 1)
  const allDetails = document.querySelectorAll("article details") as NodeListOf<HTMLDetailsElement>
  allDetails.forEach((details) => {
    const year = details.querySelector(":scope > summary")?.textContent?.trim() ?? ""
    if (/^\d{4}$/.test(year)) {
      details.open = Number(year) >= cutoff
    }
  })
})
