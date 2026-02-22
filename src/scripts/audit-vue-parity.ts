import fs from "node:fs"
import path from "node:path"

const reactDir = path.resolve("src/components/ui")
const vueDir = path.resolve("src/vue/components/ui")
// 0.35 is used as a practical triage cutoff: files below ~35% (~1/3) of React size are usually still simplified.
const GAP_THRESHOLD = 0.35
const MAX_DISPLAYED_GAPS = 20

const normalizeName = (name: string) =>
  name
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")

const listFiles = (directory: string, extension: string) =>
  fs
    .readdirSync(directory)
    .filter((file) => file.endsWith(extension))
    .map((file) => ({
      name: path.basename(file, extension),
      fullPath: path.join(directory, file),
      lines: fs.readFileSync(path.join(directory, file), "utf8").split("\n").length,
    }))

const reactFiles = listFiles(reactDir, ".tsx")
const vueFiles = listFiles(vueDir, ".vue")
type FileInfo = (typeof reactFiles)[number]
type MappedEntry = { reactFile: FileInfo; vueFile: FileInfo; ratio: number; aggregateVueLines: number }

const vueByNormalizedName = new Map(vueFiles.map((file) => [normalizeName(file.name), file]))
const FAMILY_COMPONENTS: Record<string, string[]> = {
  leaderboard: [
    "leaderboard",
    "leaderboardheader",
    "leaderboardtitle",
    "leaderboardaction",
    "leaderboardcontent",
    "leaderboarditem",
    "leaderboardstart",
    "leaderboardend",
  ],
  card: [
    "card",
    "cardheader",
    "cardtitle",
    "carddescription",
    "cardaction",
    "cardcontent",
    "cardfooter",
  ],
  descriptionlist: ["descriptionlist", "descriptionterm", "descriptiondetails"],
  field: ["field", "label", "description", "fieldset", "fieldgroup", "fielderror", "legend"],
  chart: ["chart", "areachart", "barchart", "linechart", "piechart"],
  navbar: ["navbar", "navbarsection", "navbaritem", "navbartrigger"],
  sidebar: [
    "sidebar",
    "sidebarheader",
    "sidebarcontent",
    "sidebarfooter",
    "sidebaritem",
    "sidebartrigger",
  ],
  drawer: [
    "drawer",
    "drawerheader",
    "drawertitle",
    "drawerdescription",
    "drawerbody",
    "drawerfooter",
  ],
  table: ["table", "tableheader", "tablebody", "tablerow", "tablecolumn", "tablecell"],
}

const getVueAggregate = (reactName: string) => {
  const normalizedName = normalizeName(reactName)
  const family = FAMILY_COMPONENTS[normalizedName] ?? [normalizedName]
  const familyFiles = family
    .map((name) => vueByNormalizedName.get(name))
    .filter((file): file is FileInfo => Boolean(file))

  if (familyFiles.length === 0) return null
  const primary = vueByNormalizedName.get(normalizedName) ?? familyFiles[0]
  return {
    vueFile: primary,
    lines: familyFiles.reduce((total, file) => total + file.lines, 0),
  }
}

const reactVuePairs = reactFiles.reduce<Array<MappedEntry>>((accumulator, reactFile) => {
    const vueAggregate = getVueAggregate(reactFile.name)
    if (!vueAggregate) return accumulator
    accumulator.push({
      reactFile,
      vueFile: vueAggregate.vueFile,
      aggregateVueLines: vueAggregate.lines,
      ratio: vueAggregate.lines / reactFile.lines,
    })
    return accumulator
  }, [])

const missing = reactFiles.filter((reactFile) => !vueByNormalizedName.has(normalizeName(reactFile.name)))
const potentialGaps = reactVuePairs.filter((entry) => entry.ratio < GAP_THRESHOLD).sort((a, b) => a.ratio - b.ratio)

console.log("=== Vue parity audit ===")
console.log(`React UI files: ${reactFiles.length}`)
console.log(`Vue UI files: ${vueFiles.length}`)
console.log(`Mapped by filename: ${reactVuePairs.length}`)
console.log(`Missing Vue files: ${missing.length}`)

if (missing.length > 0) {
  console.log("\nMissing component files:")
  for (const file of missing) console.log(`- ${file.name}`)
}

console.log(`\nPotential behavior/style/props gap candidates (ratio < ${GAP_THRESHOLD}): ${potentialGaps.length}`)
for (const entry of potentialGaps.slice(0, MAX_DISPLAYED_GAPS)) {
  console.log(
    `- ${entry.reactFile.name} -> ${entry.vueFile.name} | react:${entry.reactFile.lines} vue:${entry.aggregateVueLines} ratio:${entry.ratio.toFixed(2)}`,
  )
}
