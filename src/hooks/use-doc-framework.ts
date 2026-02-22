"use client"

import { useCallback, useEffect, useState } from "react"

export type DocFramework = "react" | "vue"

const STORAGE_KEY = "intentui-doc-framework"
const FRAMEWORK_EVENT = "intentui-doc-framework"

export function useDocFramework() {
  const [framework, setFrameworkState] = useState<DocFramework>("react")

  useEffect(() => {
    if (typeof window === "undefined") return
    const onFrameworkChange = (event: Event) => {
      const next = (event as CustomEvent<DocFramework>).detail
      if (next === "react" || next === "vue") {
        setFrameworkState(next)
      }
    }
    window.addEventListener(FRAMEWORK_EVENT, onFrameworkChange as EventListener)
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === "react" || stored === "vue") {
      setFrameworkState(stored)
    }
    return () => window.removeEventListener(FRAMEWORK_EVENT, onFrameworkChange as EventListener)
  }, [])

  const setFramework = useCallback((next: DocFramework) => {
    if (typeof window === "undefined") return
    setFrameworkState(next)
    localStorage.setItem(STORAGE_KEY, next)
    window.dispatchEvent(new CustomEvent(FRAMEWORK_EVENT, { detail: next }))
  }, [])

  return { framework, setFramework }
}
