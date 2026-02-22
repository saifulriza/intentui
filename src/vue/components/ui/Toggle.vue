<script setup lang="ts">
import { computed } from "vue"

const props = withDefaults(
  defineProps<{
    modelValue?: boolean
    intent?: "outline" | "plain"
    size?: "xs" | "sm" | "md" | "lg" | "sq-xs" | "sq-sm" | "sq-md" | "sq-lg"
    isCircle?: boolean
    disabled?: boolean
  }>(),
  {
    modelValue: false,
    intent: "plain",
    size: "md",
    isCircle: false,
    disabled: false,
  },
)

const emit = defineEmits<{
  "update:modelValue": [value: boolean]
}>()

const intentClass = {
  outline: "bg-transparent selected:bg-secondary outline-secondary-fg ring-secondary-fg/25 hover:bg-secondary",
  plain:
    "border-transparent bg-transparent selected:bg-secondary outline-secondary-fg ring-secondary-fg/25 hover:bg-secondary",
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
    "[--toggle-icon-active:var(--secondary-fg)] [--toggle-icon:color-mix(in_oklab,var(--secondary-fg)_50%,var(--secondary))]",
    "relative isolate inline-flex items-center justify-center border font-medium",
    "focus-visible:outline focus-visible:outline-offset-2 focus-visible:ring-2 focus-visible:ring-offset-3 focus-visible:ring-offset-bg",
    "disabled:opacity-50 forced-colors:text-[GrayText]",
    intentClass[props.intent],
    sizeClass[props.size],
    props.isCircle ? "rounded-full" : "rounded-[calc(var(--radius-lg)-1px)]",
    props.modelValue ? "bg-secondary text-secondary-fg" : "",
  ].join(" "),
)
</script>

<template>
  <button
    type="button"
    data-slot="toggle"
    :disabled="disabled"
    :aria-pressed="modelValue"
    :class="classes"
    @click="emit('update:modelValue', !modelValue)"
  >
    <slot />
  </button>
</template>
