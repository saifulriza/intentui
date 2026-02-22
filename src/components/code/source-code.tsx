"use client"

import { useEffect, useMemo, useState } from "react"
import { twJoin } from "tailwind-merge"
import { CodeHighlighter } from "@/components/code/code-highlighter"
import { CopyButton } from "@/components/code/copy-button"
import { BrandReactjsIcon } from "@/components/icons/brand-reactjs-icon"
import { useDocFramework } from "@/hooks/use-doc-framework"

type SourceCodeProps = {
  toShow: string
  message?: string
  title?: string
  ext?: string
}

export const SourceCode = ({ toShow, ...props }: SourceCodeProps) => {
  const { framework } = useDocFramework()
  const [rawSourceCode, setRawSourceCode] = useState<string | null>(null)
  const [loadingError, setLoadingError] = useState<string | null>(null)
  const processedSourceCode = useMemo(() => {
    if (!rawSourceCode) return null

    return rawSourceCode
  }, [rawSourceCode])
  useEffect(() => {
    setLoadingError(null)
    fetch(`/api/source/${framework}/${toShow}`)
      .then(async (response) => {
        if (!response.ok) {
          setLoadingError("Unable to load source code.")
          return null
        }
        const payload = await response.json()
        return payload.content as string
      })
      .then(setRawSourceCode)
      .catch((error) => {
        console.error("Failed to load source code:", error)
        setLoadingError("Unable to load source code.")
        setRawSourceCode(null)
      })
  }, [framework, toShow])

  if (processedSourceCode) {
    return (
      <section {...props} className="group not-prose relative my-6">
        <p className="mb-3 text-sm/6">
          {props.message
            ? props.message
            : "You can copy the code below and paste it into your component folder."}
        </p>
        <div
          className={twJoin(
            "overflow-hidden rounded-lg border bg-shiki-bg",
            "ring ring-border ring-offset-2 ring-offset-white dark:ring-offset-black",
          )}
        >
          {props.title && <figcaption data-rehype-pretty-code-title="">{props.title}</figcaption>}
          <div className="flex items-center justify-between border-b">
            <div className="flex cursor-default items-center gap-x-1 px-3 py-2 font-medium text-sm/6">
              {framework === "react" ? (
                <BrandReactjsIcon className="size-4 text-sky-500" />
              ) : (
                <span className="font-semibold text-emerald-500 text-xs">V</span>
              )}
              {framework === "react" ? `${toShow}.tsx` : `${toShow}.vue`}
            </div>
            <CopyButton className="grid size-10 place-content-center" text={processedSourceCode} />
          </div>
          <CodeHighlighter
            className="**:[pre]:p-4"
            removeLastLine
            plain
            code={processedSourceCode}
            lang={props.ext}
          />
        </div>
      </section>
    )
  }

  if (loadingError) {
    return <p className="my-4 text-danger text-sm">{loadingError}</p>
  }
}
