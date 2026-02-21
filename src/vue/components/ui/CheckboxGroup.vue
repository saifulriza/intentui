<script setup lang="ts">
import { provide, toRef } from "vue"

const props = withDefaults(
  defineProps<{
    modelValue?: Array<string | number>
    name?: string
  }>(),
  {
    modelValue: () => [],
  },
)

const emit = defineEmits<{
  "update:modelValue": [value: Array<string | number>]
}>()

const toggleValue = (value: string | number, checked: boolean) => {
  const current = new Set(props.modelValue)
  if (checked) {
    current.add(value)
  } else {
    current.delete(value)
  }
  emit("update:modelValue", Array.from(current))
}

provide("intent-checkbox-group", {
  modelValue: toRef(props, "modelValue"),
  name: toRef(props, "name"),
  toggleValue,
})
</script>

<template>
  <div
    data-slot="control"
    class="space-y-3 has-[[slot=description]]:space-y-6 has-[[slot=description]]:**:data-[slot=label]:font-medium **:[[slot=description]]:block"
  >
    <slot />
  </div>
</template>
