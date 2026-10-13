import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
import { FileNode } from "./quartz/components/ExplorerNode"

// explorer: year folders (e.g. talks/2026) newest first, everything else keeps the default
// order of folders before files, sorted alphabetically
const explorerSortFn = (a: FileNode, b: FileNode) => {
  const isYearFolder = (node: FileNode) => !node.file && /^\d{4}$/.test(node.name)
  if (isYearFolder(a) && isYearFolder(b)) {
    return Number(b.name) - Number(a.name)
  }

  if (!a.file === !b.file) {
    return a.displayName.localeCompare(b.displayName, undefined, {
      numeric: true,
      sensitivity: "base",
    })
  }

  return a.file ? 1 : -1
}

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [],
  footer: Component.Footer({
    links: {
      
    },
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.Breadcrumbs(),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.TagList(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Search(),
    Component.Darkmode(),
    Component.DesktopOnly(
      Component.Explorer({
        // note: this replaces the default filterFn, so "tags" must stay excluded here
        filterFn: (node) => node.name !== "tags" && node.name !== "lfx-brain",
        sortFn: explorerSortFn,
      }),
    ),
  ],
  right: [
    Component.Graph(),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
  ],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle(), Component.ContentMeta()],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Search(),
    Component.Darkmode(),
    Component.DesktopOnly(
      Component.Explorer({
        // note: this replaces the default filterFn, so "tags" must stay excluded here
        filterFn: (node) => node.name !== "tags" && node.name !== "lfx-brain",
        sortFn: explorerSortFn,
      }),
    ),
  ],
  right: [],
}
