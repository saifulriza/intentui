<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue?: string
    placeholder?: string
    disabled?: boolean
    rows?: number
    name?: string
  }>(),
  {
    disabled: false,
    rows: 3,
  },
)

const emit = defineEmits<{
  "update:modelValue": [value: string]
}>()

const textareaClasses =
  "field-sizing-content relative block min-h-16 w-full appearance-none rounded-lg px-[calc(--spacing(3.5)-1px)] py-[calc(--spacing(2.5)-1px)] sm:px-[calc(--spacing(3)-1px)] sm:py-[calc(--spacing(1.5)-1px)] text-base/6 text-fg placeholder:text-muted-fg sm:text-sm/6 border border-input enabled:hover:border-muted-fg/30 outline-hidden focus:border-ring/70 focus:ring-3 focus:ring-ring/20 focus:enabled:hover:border-ring/80 invalid:border-danger-subtle-fg/70 focus:invalid:border-danger-subtle-fg/70 focus:invalid:ring-danger-subtle-fg/20 invalid:enabled:hover:border-danger-subtle-fg/80 invalid:focus:enabled:hover:border-danger-subtle-fg/80 disabled:bg-muted forced-colors:in-disabled:text-[GrayText] in-disabled:bg-muted dark:scheme-dark"

const onInput = (event: Event) => {
  if (!(event.target instanceof HTMLTextAreaElement)) return
  emit("update:modelValue", event.target.value)
}
</script>

<template>
  <span data-slot="control" class="relative block w-full">
    <textarea
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :rows="rows"
      :name="name"
      :class="textareaClasses"
      @input="onInput"
    />
  </span>
</template>
