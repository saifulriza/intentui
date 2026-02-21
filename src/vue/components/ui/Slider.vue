<script setup lang="ts">
import { getCurrentInstance } from "vue"

const props = withDefaults(
  defineProps<{
    modelValue?: number
    min?: number
    max?: number
    step?: number
    disabled?: boolean
    orientation?: "horizontal" | "vertical"
  }>(),
  {
    modelValue: 0,
    min: 0,
    max: 100,
    step: 1,
    disabled: false,
    orientation: "horizontal",
  },
)

const emit = defineEmits<{
  "update:modelValue": [value: number]
}>()
const instance = getCurrentInstance()
const sliderId = `slider-${instance?.uid ?? 0}`

const updateValue = (event: Event) => emit("update:modelValue", Number((event.target as HTMLInputElement).value))
</script>

<template>
  <div
    data-slot="slider"
    class="group relative flex touch-none select-none flex-col gap-y-2"
    :class="orientation === 'vertical' ? 'h-full min-h-32 w-6 items-center' : 'w-full min-w-fit'"
  >
    <input
      :id="sliderId"
      data-slot="control"
      type="range"
      :aria-orientation="orientation"
      :value="modelValue"
      :min="min"
      :max="max"
      :step="step"
      :disabled="disabled"
      :class="
        orientation === 'horizontal'
          ? 'h-1.5 w-full cursor-pointer appearance-none rounded-full bg-secondary'
          : 'h-full w-1.5 cursor-pointer appearance-none rounded-full bg-secondary [writing-mode:vertical-lr] [direction:rtl]'
      "
      @input="updateValue"
    />
    <output
      data-slot="slider-output"
      :for="sliderId"
      class="font-medium text-sm/6"
    >
      {{ modelValue }}
    </output>
  </div>
</template>
