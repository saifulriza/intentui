<script setup lang="ts">
import { provide, toRef } from "vue"

const props = defineProps<{
  modelValue?: string | number | boolean | null
  name?: string
}>()

const emit = defineEmits<{
  "update:modelValue": [value: string | number | boolean | null]
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
    class="space-y-3 **:data-[slot=label]:font-normal has-[slot=description]:space-y-6 has-[[slot=description]]:**:data-[slot=label]:font-medium"
  >
    <slot />
  </div>
</template>
