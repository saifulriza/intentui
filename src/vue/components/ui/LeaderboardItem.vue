<script setup lang="ts">
import { computed } from "vue"

const props = withDefaults(
  defineProps<{
    value?: number
    minValue?: number
    maxValue?: number
    clickable?: boolean
  }>(),
  {
    value: 0,
    minValue: 0,
    maxValue: 100,
    clickable: false,
  },
)

const percentage = computed(() => {
  const range = props.maxValue - props.minValue
  if (range <= 0) return 0
  return Math.max(0, Math.min(100, ((props.value - props.minValue) / range) * 100))
})
</script>

<template>
  <li class="group" data-slot="leaderboard-item">
    <div
      class="relative overflow-hidden rounded-md px-1.5 py-1 text-sm/6 outline-hidden focus-visible:ring focus-visible:ring-ring"
      :class="clickable ? 'cursor-pointer' : ''"
    >
      <span class="relative z-20 flex items-center justify-between font-medium">
        <slot :percentage="percentage" :value="value" />
      </span>
      <span
        class="absolute inset-y-0 start-0 z-10 rounded-e-md bg-secondary/60"
        :class="clickable ? 'group-hover:bg-secondary' : ''"
        :style="{ width: `${percentage}%` }"
      />
    </div>
  </li>
</template>
