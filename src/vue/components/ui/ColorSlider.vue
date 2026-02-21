<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    id?: string
    modelValue?: number
    min?: number
    max?: number
    step?: number
    disabled?: boolean
    orientation?: "horizontal" | "vertical"
    label?: string
  }>(),
  {
    id: "color-slider",
    modelValue: 0,
    min: 0,
    max: 360,
    step: 1,
    disabled: false,
    orientation: "horizontal",
    label: "Color value",
  },
)

const emit = defineEmits<{
  "update:modelValue": [value: number]
}>()

const onInput = (event: Event) => {
  const next = Number((event.target as HTMLInputElement).value)
  emit("update:modelValue", next)
}

const gradient =
  "linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)"
</script>

<template>
  <div
    data-slot="color-slider"
    class="grid w-full gap-2"
    :class="orientation === 'vertical' ? 'max-w-14 justify-items-center' : 'grid-cols-[1fr_auto]'"
  >
    <input
      type="range"
      :id="id"
      data-slot="control"
      :aria-label="label"
      class="h-6 w-full cursor-pointer appearance-none rounded-lg bg-transparent disabled:opacity-50"
      :class="orientation === 'vertical' ? 'h-56 w-6 rotate-180 [writing-mode:vertical-lr]' : ''"
      :min="min"
      :max="max"
      :step="step"
      :disabled="disabled"
      :value="modelValue"
      :style="{
        background: `${gradient}, repeating-conic-gradient(#CCC 0% 25%, white 0% 50%) 50% / 16px 16px`,
      }"
      @input="onInput"
    />
    <output :for="id" class="font-medium text-base/6 sm:text-sm/6">{{ modelValue }}</output>
    <slot />
  </div>
</template>
