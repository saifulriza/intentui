<script setup lang="ts">
import { computed } from "vue"

const props = withDefaults(
  defineProps<{
    modelValue?: number
    minValue?: number
    maxValue?: number
    onAction?: () => void
  }>(),
  {
    modelValue: 0,
    minValue: 0,
    maxValue: 100,
    onAction: undefined,
  },
)

const emit = defineEmits<{
  action: []
}>()

const isClickable = computed(() => typeof props.onAction === "function")

const percentage = computed(() => {
  const range = props.maxValue - props.minValue
  if (range <= 0) return 0
  return Math.max(0, Math.min(100, ((props.modelValue - props.minValue) / range) * 100))
})

const handleAction = () => {
  if (!isClickable.value) return
  props.onAction?.()
  emit("action")
}
</script>

<template>
  <li class="group" data-slot="leaderboard-item">
    <div
      class="relative overflow-hidden rounded-md px-1.5 py-1 text-sm/6 outline-hidden focus-visible:ring focus-visible:ring-ring"
      :class="isClickable ? 'cursor-pointer' : ''"
      role="progressbar"
      :aria-valuenow="modelValue"
      :aria-valuemin="minValue"
      :aria-valuemax="maxValue"
      :tabindex="isClickable ? 0 : undefined"
      @click="handleAction"
      @keydown.enter.prevent="handleAction"
      @keydown.space.prevent="handleAction"
    >
      <span class="relative z-20 flex items-center justify-between font-medium">
        <slot :percentage="percentage" :value="modelValue" />
      </span>
      <span
        class="absolute inset-y-0 start-0 z-10 rounded-e-md bg-secondary/60"
        :class="isClickable ? 'group-hover:bg-secondary' : ''"
        :style="{ width: `${percentage}%` }"
      />
    </div>
  </li>
</template>
