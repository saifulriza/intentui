<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    modelValue?: string
    min?: string
    max?: string
    disabled?: boolean
    step?: number
    ariaLabel?: string
  }>(),
  {
    modelValue: "",
    disabled: false,
    step: 60,
    ariaLabel: "Time",
  },
)

const emit = defineEmits<{
  "update:modelValue": [value: string]
}>()

const onInput = (event: Event) => {
  emit("update:modelValue", (event.target as HTMLInputElement).value)
}
</script>

<template>
  <div data-slot="time-field" class="w-fit">
    <input
      data-slot="control"
      type="time"
      :value="modelValue"
      :min="min"
      :max="max"
      :step="step"
      :disabled="disabled"
      :aria-label="ariaLabel"
      class="relative block appearance-none rounded-lg border border-input px-3 py-2 text-base/6 text-fg outline-hidden sm:text-sm/6"
      @input="onInput"
    />
  </div>
</template>
