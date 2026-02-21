"use client"

import { useRouter } from "next/navigation"
import { Providers } from "@/components/providers"

declare module "react-aria-components" {
  interface RouterConfig {
    routerOptions: NonNullable<Parameters<ReturnType<typeof useRouter>["push"]>[1]>
  }
}

export function NextProviders({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  return <Providers navigate={router.push}>{children}</Providers>
}
