<script setup lang="ts">
import { computed } from "vue"

const props = withDefaults(
  defineProps<{
    intent?: "primary" | "secondary" | "warning" | "danger" | "outline" | "plain"
    size?: "xs" | "sm" | "md" | "lg" | "sq-xs" | "sq-sm" | "sq-md" | "sq-lg"
    isCircle?: boolean
    disabled?: boolean
    type?: "button" | "submit" | "reset"
  }>(),
  {
    intent: "primary",
    size: "md",
    isCircle: false,
    disabled: false,
    type: "button",
  },
)

const intentClass = {
  primary:
    "[--btn-bg:var(--color-primary)] [--btn-fg:var(--color-primary-fg)] [--btn-icon-active:var(--primary-fg)]/80 [--btn-icon:var(--primary-fg)]/60 [--btn-overlay:color-mix(in_oklab,var(--color-primary-fg)_10%,var(--color-primary)_90%)]",
  secondary:
    "[--btn-bg:var(--color-secondary)] [--btn-fg:var(--color-secondary-fg)] [--btn-icon:var(--color-muted-fg)] [--btn-outline:var(--color-secondary-fg)] [--btn-overlay:color-mix(in_oklab,var(--color-secondary-fg)_10%,var(--color-secondary)_90%)] [--btn-ring:var(--color-muted-fg)]/20",
  warning:
    "[--btn-bg:var(--color-warning)] [--btn-fg:var(--color-warning-fg)] [--btn-icon:var(--color-warning-fg)]/60 [--btn-overlay:color-mix(in_oklab,var(--color-white)_10%,var(--color-warning)_90%)]",
  danger:
    "[--btn-bg:var(--color-danger)] [--btn-fg:var(--color-danger-fg)] [--btn-icon:color-mix(in_oklab,var(--color-danger-fg)_60%,var(--danger)_40%)] [--btn-overlay:color-mix(in_oklab,var(--color-white)_10%,var(--color-danger)_90%)]",
  outline:
    "border-border [--btn-bg:transparent] [--btn-icon:var(--color-muted-fg)] [--btn-outline:var(--color-ring)] [--btn-overlay:var(--color-secondary)] [--btn-ring:var(--color-ring)]/20",
  plain:
    "border-transparent [--btn-bg:transparent] [--btn-icon:var(--color-muted-fg)] [--btn-outline:var(--color-ring)] [--btn-overlay:var(--color-secondary)] [--btn-ring:var(--color-ring)]/20",
} as const

const sizeClass = {
  xs: "min-h-8 gap-x-1.5 px-[calc(--spacing(3)-1px)] py-[calc(--spacing(1.5)-1px)] text-sm sm:min-h-7 sm:px-2 sm:py-[calc(--spacing(1.5)-1px)] sm:text-xs/4",
  sm: "min-h-9 gap-x-1.5 px-3 py-[calc(--spacing(2)-1px)] sm:min-h-8 sm:px-[calc(--spacing(3)-1px)] sm:py-[calc(--spacing(1.5)-1px)] sm:text-sm/5",
  md: "min-h-10 gap-x-2 px-[calc(--spacing(3.5)-1px)] py-[calc(--spacing(2.5)-1px)] sm:min-h-9 sm:px-3 sm:py-[calc(--spacing(1.5)-1px)] sm:text-sm/6",
  lg: "min-h-10 gap-x-2 px-[calc(--spacing(3.5)-1px)] py-[calc(--spacing(3)-1px)] sm:min-h-9 sm:px-3 sm:py-[calc(--spacing(1.5)-1px)] sm:text-sm/7",
  "sq-xs": "touch-target size-8 sm:size-7",
  "sq-sm": "touch-target size-10 sm:size-8",
  "sq-md": "touch-target size-11 sm:size-9",
  "sq-lg": "touch-target size-12 sm:size-10",
} as const

const classes = computed(() =>
  [
    "[--btn-border:var(--color-fg)]/15 [--btn-icon-active:var(--btn-fg)] [--btn-outline:var(--btn-bg)] [--btn-radius:calc(var(--radius-lg)-1px)] [--btn-ring:var(--btn-bg)]/20",
    "bg-(--btn-bg) text-(--btn-fg) outline-(--btn-outline) ring-(--btn-ring) hover:bg-(--btn-overlay)",
    "relative isolate inline-flex items-center justify-center border border-(--btn-border) font-medium hover:no-underline",
    "focus:outline-0 focus-visible:outline focus-visible:outline-offset-2 focus-visible:ring-2 focus-visible:ring-offset-3 focus-visible:ring-offset-bg",
    "disabled:opacity-50 disabled:forced-colors:text-[GrayText]",
    intentClass[props.intent],
    sizeClass[props.size],
    props.isCircle ? "rounded-full" : "rounded-lg",
  ].join(" "),
)
</script>

<template>
  <button :type="type" :disabled="disabled" :class="classes">
    <slot />
  </button>
</template>
