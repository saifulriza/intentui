<script setup lang="ts">
import { provide, toRef } from "vue"

const props = defineProps<{
  modelValue?: string | number | boolean
  name?: string
}>()

const emit = defineEmits<{
  "update:modelValue": [value: string | number | boolean]
}>()

const selectValue = (value: string | number | boolean) => {
  emit("update:modelValue", value)
}

provide("intent-radio-group", {
  modelValue: toRef(props, "modelValue"),
  name: toRef(props, "name"),
  selectValue,
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
