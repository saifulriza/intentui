import { promises as fs } from "node:fs"
import path from "node:path"
import { NextResponse } from "next/server"

function toPascalCase(value: string) {
  return value
    .split("-")
    .filter((segment) => segment.length > 0)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join("")
}

export async function GET(
  _: Request,
  { params }: { params: Promise<{ framework: string; slug: string }> },
) {
  const { framework, slug } = await params
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    return NextResponse.json({ error: "invalid slug" }, { status: 400 })
  }

  const rootDir = path.resolve(process.cwd(), "src")
  let baseDir: string | null = null
  let fileName: string | null = null

  if (framework === "react") {
    baseDir = path.resolve(rootDir, "components", "ui")
    fileName = `${slug}.tsx`
  } else if (framework === "vue") {
    baseDir = path.resolve(rootDir, "vue", "components", "ui")
    fileName = `${toPascalCase(slug)}.vue`
  }

  if (!baseDir || !fileName) {
    return NextResponse.json({ error: "framework not supported" }, { status: 400 })
  }

  const targetPath = path.resolve(baseDir, fileName)
  const relativePath = path.relative(baseDir, targetPath)
  if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
    return NextResponse.json({ error: "invalid source path" }, { status: 400 })
  }

  try {
    const content = await fs.readFile(targetPath, "utf8")
    return NextResponse.json({ content })
  } catch {
    return NextResponse.json({ error: "source not found" }, { status: 404 })
  }
}
