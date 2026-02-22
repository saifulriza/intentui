<script setup lang="ts">
import { computed } from "vue"

const props = withDefaults(
  defineProps<{
    modelValue?: number
    max?: number
    isIndeterminate?: boolean
  }>(),
  {
    modelValue: 0,
    max: 100,
    isIndeterminate: false,
  },
)

const percentage = computed(() => Math.max(0, Math.min(100, (props.modelValue / props.max) * 100)))
</script>

<template>
  <svg class="size-4 shrink-0" viewBox="0 0 24 24" fill="none" data-slot="icon" role="presentation">
    <circle cx="50%" cy="50%" r="calc(50% - 2px)" stroke-width="3" stroke="currentColor" stroke-opacity="0.25" />
    <circle
      v-if="!isIndeterminate"
      cx="50%"
      cy="50%"
      r="calc(50% - 2px)"
      stroke-width="3"
      stroke="currentColor"
      path-length="100"
      stroke-dasharray="100 200"
      :stroke-dashoffset="100 - percentage"
      stroke-linecap="round"
      transform="rotate(-90)"
      class="origin-center"
    />
    <circle
      v-else
      cx="50%"
      cy="50%"
      r="calc(50% - 2px)"
      stroke-width="3"
      stroke="currentColor"
      path-length="100"
      stroke-dasharray="100 200"
      stroke-dashoffset="70"
      stroke-linecap="round"
      class="origin-center animate-[spin_1s_cubic-bezier(0.4,0,0.2,1)_infinite]"
    />
  </svg>
</template>
