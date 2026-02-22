"use client"

import { twJoin } from "tailwind-merge"
import { BrandReactjsIcon } from "@/components/icons/brand-reactjs-icon"
import { useDocFramework } from "@/hooks/use-doc-framework"

export function DocsFrameworkSwitch() {
  const { framework, setFramework } = useDocFramework()
  const switchButtonClass =
    "inline-flex cursor-default items-center gap-x-1.5 rounded-md px-2.5 py-1 font-medium text-sm/6 outline-hidden"

  return (
    <div className="not-prose inline-flex items-center rounded-lg border p-0.5">
      <button
        className={twJoin(
          switchButtonClass,
          framework === "react" ? "bg-muted text-fg" : "text-muted-fg hover:text-fg",
        )}
        onClick={() => setFramework("react")}
        type="button"
      >
        <BrandReactjsIcon className="size-4 text-sky-500" />
        React
      </button>
      <button
        className={twJoin(
          switchButtonClass,
          framework === "vue" ? "bg-muted text-fg" : "text-muted-fg hover:text-fg",
        )}
        onClick={() => setFramework("vue")}
        type="button"
      >
        <span className="font-semibold text-emerald-500 text-xs">V</span>
        Vue
      </button>
    </div>
  )
}
