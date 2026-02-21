<script setup lang="ts">
import { provide, toRef } from "vue"

const props = withDefaults(
  defineProps<{
    modelValue?: string | Array<string>
    selectionMode?: "single" | "multiple"
    orientation?: "horizontal" | "vertical"
    size?: "xs" | "sm" | "md" | "lg" | "sq-xs" | "sq-sm" | "sq-md" | "sq-lg"
    isCircle?: boolean
  }>(),
  {
    selectionMode: "single",
    orientation: "horizontal",
    size: "md",
    isCircle: false,
  },
)

const emit = defineEmits<{
  "update:modelValue": [value: string | Array<string>]
}>()

const toggleValue = (value: string) => {
  if (props.selectionMode === "single") {
    emit("update:modelValue", props.modelValue === value ? "" : value)
    return
  }
  const current = new Set(Array.isArray(props.modelValue) ? props.modelValue : [])
  if (current.has(value)) current.delete(value)
  else current.add(value)
  emit("update:modelValue", Array.from(current))
}

provide("intent-toggle-group", {
  modelValue: toRef(props, "modelValue"),
  selectionMode: toRef(props, "selectionMode"),
  orientation: toRef(props, "orientation"),
  size: toRef(props, "size"),
  toggleValue,
})
</script>

<template>
  <div
    data-slot="control"
    class="[--toggle-group-radius:var(--radius-lg)] [--toggle-gutter:--spacing(0.5)] [--toggle-fg:var(--color-fg)] [--toggle-selected-bg:var(--color-primary)] [--toggle-selected-fg:var(--color-primary-fg)] [--toggle-focused-bg:var(--color-secondary)] [--toggle-focused-fg:var(--color-secondary-fg)] [--toggle-hover-bg:var(--toggle-focused-bg)] [--toggle-hover-fg:var(--toggle-focused-fg)] inset-ring inset-ring-border inline-flex overflow-hidden p-(--toggle-gutter)"
    :class="[
      orientation === 'horizontal' ? 'flex-row' : 'flex-col',
      selectionMode === 'single' ? 'gap-(--toggle-gutter)' : 'gap-0',
      isCircle ? 'rounded-full' : 'rounded-(--toggle-group-radius)',
    ]"
  >
    <slot />
  </div>
</template>
