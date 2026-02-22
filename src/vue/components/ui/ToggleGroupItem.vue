<script setup lang="ts">
import { computed, inject } from "vue"

const props = defineProps<{
  value: string
  disabled?: boolean
}>()

const group = inject<{
  modelValue: { value?: string | Array<string> }
  selectionMode: { value: "single" | "multiple" }
  orientation: { value: "horizontal" | "vertical" }
  size: { value: "xs" | "sm" | "md" | "lg" | "sq-xs" | "sq-sm" | "sq-md" | "sq-lg" }
  isCircle: { value: boolean }
  toggleValue: (value: string) => void
}>("intent-toggle-group")

const isSelected = computed(() =>
  Array.isArray(group?.modelValue.value)
    ? group?.modelValue.value.includes(props.value)
    : group?.modelValue.value === props.value,
)

const sizeClass = {
  xs: "min-h-8 gap-x-1.5 px-2.5 py-1.5 text-sm sm:min-h-7 sm:px-2 sm:py-1.5 sm:text-xs/4",
  sm: "min-h-9 gap-x-1.5 px-3 py-1.5 sm:min-h-8 sm:px-2.5 sm:py-1.5 sm:text-sm/5",
  md: "min-h-10 gap-x-2 px-3.5 py-2 sm:min-h-9 sm:px-3 sm:py-1.5 sm:text-sm/6",
  lg: "min-h-11 gap-x-2 px-4 py-2.5 sm:min-h-10 sm:px-3.5 sm:py-2 sm:text-sm/6",
  "sq-xs": "touch-target size-8 sm:size-7",
  "sq-sm": "touch-target size-9 sm:size-8",
  "sq-md": "touch-target size-10 sm:size-9",
  "sq-lg": "touch-target size-11 sm:size-10",
} as const

const classes = computed(() =>
  [
    "relative isolate inline-flex items-center font-medium outline-hidden inset-ring inset-ring-transparent",
    group?.orientation.value === "horizontal" ? "justify-center" : "justify-start",
    group?.selectionMode.value === "single"
      ? "rounded-[calc(var(--toggle-group-radius)-var(--toggle-gutter))]"
      : "rounded-none",
    sizeClass[group?.size.value ?? "md"],
    isSelected.value
      ? "inset-ring-fg/20 bg-(--toggle-selected-bg) text-(--toggle-selected-fg)"
      : "text-(--toggle-fg) hover:bg-(--toggle-hover-bg) hover:text-(--toggle-hover-fg)",
    group?.selectionMode.value === "multiple" && group?.orientation.value === "horizontal"
      ? "not-first:-ms-px first:rounded-s-[calc(var(--toggle-group-radius)-var(--toggle-gutter))] last:rounded-e-[calc(var(--toggle-group-radius)-var(--toggle-gutter))]"
      : "",
    group?.selectionMode.value === "multiple" && group?.orientation.value === "vertical"
      ? "not-first:-mt-px first:rounded-t-[calc(var(--toggle-group-radius)-var(--toggle-gutter))] last:rounded-b-[calc(var(--toggle-group-radius)-var(--toggle-gutter))]"
      : "",
    group?.isCircle.value ? "rounded-full" : "",
    props.disabled ? "opacity-50 forced-colors:text-[GrayText]" : "",
  ].join(" "),
)
</script>

<template>
  <button
    type="button"
    data-slot="toggle-group-item"
    :disabled="disabled"
    :aria-pressed="isSelected"
    :class="classes"
    @click="group?.toggleValue(value)"
  >
    <slot />
  </button>
</template>
