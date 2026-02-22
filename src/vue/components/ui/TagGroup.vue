<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    modelValue?: string[]
    label?: string
    disabled?: boolean
    readOnly?: boolean
  }>(),
  {
    modelValue: () => [],
    disabled: false,
    readOnly: false,
  },
)

const emit = defineEmits<{
  "update:modelValue": [value: string[]]
}>()

const removeTag = (tag: string) => {
  if (props.readOnly || props.disabled) return
  emit(
    "update:modelValue",
    props.modelValue.filter((entry) => entry !== tag),
  )
}
</script>

<template>
  <div data-slot="tag-group" class="flex flex-col gap-y-1">
    <span v-if="label" data-slot="label" class="font-medium text-sm/6">{{ label }}</span>
    <div data-slot="tag-list" class="flex flex-wrap gap-1">
      <span
        v-for="tag in modelValue"
        :key="tag"
        data-slot="tag"
        class="inline-flex items-center gap-x-1.5 rounded-full px-2 py-0.5 font-medium text-xs/5 inset-ring inset-ring-input dark:bg-input/30"
      >
        {{ tag }}
        <button
          type="button"
          data-slot="tag-remove"
          class="-me-1 rounded text-muted-fg hover:text-fg"
          :disabled="disabled || readOnly"
          @click="removeTag(tag)"
        >
          <span aria-hidden="true">✕</span>
          <span class="sr-only">Remove {{ tag }}</span>
        </button>
      </span>
      <slot />
    </div>
  </div>
</template>
