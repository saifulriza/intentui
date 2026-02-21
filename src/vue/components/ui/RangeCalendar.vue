<script setup lang="ts">
import Calendar from "./Calendar.vue"

const props = withDefaults(
  defineProps<{
    startValue?: string
    endValue?: string
  }>(),
  {
    startValue: "",
    endValue: "",
  },
)

const emit = defineEmits<{
  "update:startValue": [value: string]
  "update:endValue": [value: string]
}>()
</script>

<template>
  <div data-slot="range-calendar" class="flex flex-col gap-3 sm:flex-row">
    <div>
      <p class="mb-2 text-xs text-muted-fg">Start date</p>
      <Calendar :model-value="startValue" @update:model-value="emit('update:startValue', $event)" />
    </div>
    <div>
      <p class="mb-2 text-xs text-muted-fg">End date</p>
      <Calendar :model-value="endValue" @update:model-value="emit('update:endValue', $event)" />
    </div>
  </div>
</template>
