<script setup lang="ts">
import { computed } from "vue"

const props = withDefaults(
  defineProps<{
    modelValue?: number
    max?: number
    color?: string
    label?: string
  }>(),
  {
    modelValue: 0,
    max: 100,
    label: "Meter",
  },
)

const percentage = computed(() => Math.max(0, Math.min(100, (props.modelValue / props.max) * 100)))
const fillColor = computed(() => {
  if (props.color) return props.color
  if (percentage.value < 50) return "var(--color-success)"
  if (percentage.value < 80) return "var(--color-warning)"
  return "var(--color-danger)"
})
</script>

<template>
  <div
    data-slot="meter"
    class="w-full [&>[data-slot=meter-header]+[data-slot=meter-track]]:mt-2 [&>[data-slot=meter-header]+[slot='description']]:mt-1 [&>[slot='description']+[data-slot=meter-track]]:mt-2 [&>[data-slot=meter-track]+[slot=description]]:mt-2 [&>[data-slot=meter-track]+[slot=errorMessage]]:mt-2 *:data-[slot=meter-header]:font-medium"
    role="meter"
    :aria-label="label"
    :aria-valuenow="modelValue"
    aria-valuemin="0"
    :aria-valuemax="max"
  >
    <div data-slot="meter-track" class="[--meter-height:--spacing(1.5)] relative h-(--meter-height) w-full overflow-hidden rounded-full bg-secondary outline outline-transparent -outline-offset-1">
      <div
        data-slot="meter-fill"
        class="absolute start-0 top-0 h-full rounded-full transition-[width] duration-200 ease-linear will-change-[width] motion-reduce:transition-none forced-colors:bg-[Highlight]"
        :style="{ width: `${percentage}%`, backgroundColor: fillColor }"
      />
    </div>
  </div>
</template>
