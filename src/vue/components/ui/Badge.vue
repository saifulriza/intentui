<script setup lang="ts">
import { computed } from "vue"

const props = withDefaults(
  defineProps<{
    intent?: "primary" | "secondary" | "success" | "info" | "warning" | "danger" | "outline"
    isCircle?: boolean
  }>(),
  {
    intent: "primary",
    isCircle: true,
  },
)

const intentClass = {
  primary:
    "[--badge-bg:var(--color-primary-subtle)] [--badge-fg:var(--color-primary-subtle-fg)] [--badge-overlay:var(--color-primary)]/20",
  secondary:
    "[--badge-bg:var(--color-secondary)] [--badge-fg:var(--color-secondary-fg)] [--badge-overlay:var(--color-muted-fg)]/25",
  success:
    "[--badge-bg:var(--color-success-subtle)] [--badge-fg:var(--color-success-subtle-fg)] [--badge-overlay:var(--color-success)]/20",
  info: "[--badge-bg:var(--color-info-subtle)] [--badge-fg:var(--color-info-subtle-fg)] [--badge-overlay:var(--color-sky-500)]/20",
  warning:
    "[--badge-bg:var(--color-warning-subtle)] [--badge-fg:var(--color-warning-subtle-fg)] [--badge-overlay:var(--color-warning)]/20",
  danger:
    "[--badge-bg:var(--color-danger-subtle)] [--badge-fg:var(--color-danger-subtle-fg)] [--badge-overlay:var(--color-danger)]/20",
  outline: "[--badge-border:var(--color-border)] [--badge-overlay:var(--color-secondary)]/20",
} as const

const classes = computed(() =>
  [
    "inline-flex items-center gap-x-1.5 py-px font-medium text-xs/5 forced-colors:outline",
    "border border-(--badge-border,transparent) bg-(--badge-bg) text-(--badge-fg)",
    "duration-200",
    intentClass[props.intent],
    props.isCircle ? "rounded-full px-[calc(--spacing(2)-1px)]" : "rounded-sm px-[calc(--spacing(1.5)-1px)]",
  ].join(" "),
)
</script>

<template>
  <span :class="classes">
    <slot />
  </span>
</template>
