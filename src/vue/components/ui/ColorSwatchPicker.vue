<script setup lang="ts">
import ColorSwatch from "./ColorSwatch.vue"

type ColorOption = {
  id: string
  color: string
  label?: string
  disabled?: boolean
}

const props = withDefaults(
  defineProps<{
    modelValue?: string | string[]
    options?: ColorOption[]
    selectionMode?: "single" | "multiple"
  }>(),
  {
    modelValue: "",
    options: () => [],
    selectionMode: "single",
  },
)

const emit = defineEmits<{
  "update:modelValue": [value: string | string[]]
}>()

const isSelected = (id: string) =>
  Array.isArray(props.modelValue) ? props.modelValue.includes(id) : props.modelValue === id

const toggle = (option: ColorOption) => {
  if (option.disabled) return
  if (props.selectionMode === "multiple") {
    const values = Array.isArray(props.modelValue) ? [...props.modelValue] : []
    const index = values.indexOf(option.id)
    if (index >= 0) values.splice(index, 1)
    else values.push(option.id)
    emit("update:modelValue", values)
    return
  }
  emit("update:modelValue", option.id)
}
</script>

<template>
  <div data-slot="color-swatch-picker" class="flex flex-wrap gap-2">
    <button
      v-for="option in options"
      :key="option.id"
      type="button"
      class="relative rounded-lg outline-hidden transition-opacity hover:opacity-90 disabled:opacity-50"
      :aria-label="option.label || option.id"
      :aria-pressed="isSelected(option.id) ? 'true' : 'false'"
      :disabled="option.disabled"
      @click="toggle(option)"
    >
      <ColorSwatch :color="option.color" rounded="lg" />
      <span
        v-if="isSelected(option.id)"
        aria-hidden="true"
        class="pointer-events-none absolute bottom-1.5 left-1/2 size-1.5 -translate-x-1/2 rounded-full bg-white ring-1 ring-black/50 dark:bg-black dark:ring-white/50"
      />
    </button>
    <slot />
  </div>
</template>
