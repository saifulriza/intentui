<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    modelValue?: string
    min?: string
    max?: string
    disabled?: boolean
    ariaLabel?: string
  }>(),
  {
    modelValue: "",
    disabled: false,
    ariaLabel: "Date",
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
  <div data-slot="date-field" class="w-fit">
    <input
      data-slot="control"
      type="date"
      :value="modelValue"
      :min="min"
      :max="max"
      :disabled="disabled"
      :aria-label="ariaLabel"
      class="relative block appearance-none rounded-lg border border-input px-3 py-2 text-base/6 text-fg outline-hidden sm:text-sm/6"
      @input="onInput"
    />
  </div>
</template>
