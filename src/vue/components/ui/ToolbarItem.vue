<script setup lang="ts">
import { inject } from "vue"
import Toggle from "./Toggle.vue"

const props = withDefaults(
  defineProps<{
    modelValue?: boolean
    disabled?: boolean
    isCircle?: boolean
    size?: "xs" | "sm" | "md" | "lg" | "sq-xs" | "sq-sm" | "sq-md" | "sq-lg"
    intent?: "outline" | "plain"
  }>(),
  {
    modelValue: false,
    disabled: false,
    isCircle: false,
    size: "sm",
    intent: "outline",
  },
)

const emit = defineEmits<{
  "update:modelValue": [value: boolean]
}>()

const toolbar = inject<{ isCircle: { value: boolean } } | null>("intent-toolbar", null)
</script>

<template>
  <Toggle
    data-slot="toolbar-item"
    :model-value="modelValue"
    :disabled="disabled"
    :size="size"
    :intent="intent"
    :is-circle="isCircle || toolbar?.isCircle?.value"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <slot />
  </Toggle>
</template>
