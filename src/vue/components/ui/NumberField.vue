<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    modelValue?: number
    min?: number
    max?: number
    step?: number
    disabled?: boolean
  }>(),
  {
    modelValue: 0,
    step: 1,
    disabled: false,
  },
)

const emit = defineEmits<{
  "update:modelValue": [value: number]
}>()

const clamp = (value: number) => {
  if (typeof props.min === "number" && typeof props.max === "number" && props.min > props.max) {
    return value
  }
  if (typeof props.min === "number" && value < props.min) return props.min
  if (typeof props.max === "number" && value > props.max) return props.max
  return value
}

const setValue = (value: number) => emit("update:modelValue", clamp(value))
const increment = () => setValue((props.modelValue ?? 0) + props.step)
const decrement = () => setValue((props.modelValue ?? 0) - props.step)
const onInput = (event: Event) => {
  const parsed = Number((event.target as HTMLInputElement).value)
  if (Number.isNaN(parsed)) return
  setValue(parsed)
}
</script>

<template>
  <div data-slot="number-field" class="w-fit">
    <div data-slot="control" class="flex w-fit items-center rounded-lg border border-input">
      <input
        type="number"
        :value="modelValue"
        :min="min"
        :max="max"
        :step="step"
        :disabled="disabled"
        class="w-24 border-0 bg-transparent px-3 py-2 text-base/6 text-fg outline-hidden sm:text-sm/6"
        @input="onInput"
      />
      <div class="flex h-full items-center divide-x border-s">
        <button
          type="button"
          class="inline-grid min-w-9 place-content-center px-2 py-2 text-muted-fg hover:text-fg disabled:opacity-50"
          :disabled="disabled"
          @click="decrement"
        >
          <span aria-hidden="true">−</span>
          <span class="sr-only">Decrement</span>
        </button>
        <button
          type="button"
          class="inline-grid min-w-9 place-content-center px-2 py-2 text-muted-fg hover:text-fg disabled:opacity-50"
          :disabled="disabled"
          @click="increment"
        >
          <span aria-hidden="true">+</span>
          <span class="sr-only">Increment</span>
        </button>
      </div>
    </div>
  </div>
</template>
