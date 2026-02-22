<script setup lang="ts">
import { computed } from "vue"
const DEFAULT_COLOR = "#3b82f6"

const props = withDefaults(
  defineProps<{
    modelValue?: string
    disabled?: boolean
    ariaLabel?: string
  }>(),
  {
    modelValue: DEFAULT_COLOR,
    disabled: false,
    ariaLabel: "Color field",
  },
)

const emit = defineEmits<{
  "update:modelValue": [value: string]
}>()

const normalized = computed(() => {
  const value = (props.modelValue || "").trim()
  return /^#[0-9a-fA-F]{6}$/.test(value) ? value : DEFAULT_COLOR
})

const onPicker = (event: Event) => emit("update:modelValue", (event.target as HTMLInputElement).value)
const onText = (event: Event) => emit("update:modelValue", (event.target as HTMLInputElement).value)
</script>

<template>
  <div data-slot="color-field" class="w-fit">
    <div data-slot="control" class="flex items-center gap-2 rounded-lg border border-input p-1 pe-2">
      <input
        type="color"
        :value="normalized"
        :disabled="disabled"
        :aria-label="ariaLabel"
        class="size-9 cursor-pointer rounded-md border-0 bg-transparent p-0"
        @input="onPicker"
      />
      <input
        type="text"
        :value="normalized"
        :disabled="disabled"
        aria-label="Hex color value"
        class="w-24 rounded-md border-0 bg-transparent px-2 py-1 text-sm text-fg outline-hidden"
        @input="onText"
      />
    </div>
  </div>
</template>
