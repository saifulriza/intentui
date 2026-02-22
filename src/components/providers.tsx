"use client"

import { RouterProvider } from "react-aria-components"
import { ThemeProvider } from "@/components/theme-provider"

type Navigate = NonNullable<React.ComponentProps<typeof RouterProvider>["navigate"]>
interface Props {
  children: React.ReactNode
  navigate?: Navigate
}

const fallbackNavigate: Navigate = (href) => window.location.assign(href.toString())

export function Providers({ children, navigate = fallbackNavigate }: Props) {
  return (
    <RouterProvider navigate={navigate}>
      <ThemeProvider enableSystem disableTransitionOnChange attribute="class">
        {children}
      </ThemeProvider>
    </RouterProvider>
  )
}
