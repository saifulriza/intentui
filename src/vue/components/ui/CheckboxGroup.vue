<script setup lang="ts">
import { provide, toRef } from "vue"

const defaultModelValue = () => [] as Array<string | number>

const props = withDefaults(
  defineProps<{
    modelValue?: Array<string | number>
    name?: string
  }>(),
  {
    modelValue: defaultModelValue,
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
    class="space-y-3"
  >
    <slot />
  </div>
</template>
