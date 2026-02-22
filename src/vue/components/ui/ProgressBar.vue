<script setup lang="ts">
import { computed } from "vue"

const props = withDefaults(
  defineProps<{
    modelValue?: number
    max?: number
    isIndeterminate?: boolean
    label?: string
  }>(),
  {
    modelValue: 0,
    max: 100,
    isIndeterminate: false,
    label: "Pending...",
  },
)

const percentage = computed(() => Math.max(0, Math.min(100, (props.modelValue / props.max) * 100)))
</script>

<template>
  <div
    data-slot="control"
    class="w-full [&>[data-slot=progress-bar-header]+[data-slot=progress-bar-track]]:mt-2 [&>[data-slot=progress-bar-header]+[slot='description']]:mt-1 [&>[slot='description']+[data-slot=progress-bar-track]]:mt-2 [&>[data-slot=progress-bar-track]+[slot=description]]:mt-2 [&>[data-slot=progress-bar-track]+[slot=errorMessage]]:mt-2 *:data-[slot=progress-bar-header]:font-medium"
    role="progressbar"
    :aria-label="label"
    :aria-valuenow="isIndeterminate ? undefined : modelValue"
    :aria-valuemin="0"
    :aria-valuemax="max"
  >
    <div data-slot="progress-bar-track" class="relative block w-full">
      <div class="flex w-full items-center gap-x-2">
        <div
          data-slot="progress-container"
          class="[--progress-content-bg:var(--color-primary)] relative h-1.5 w-full min-w-52 overflow-hidden rounded-full bg-(--progress-container-bg,var(--color-secondary)) outline-1 outline-transparent -outline-offset-1 will-change-transform"
        >
          <div
            v-if="!isIndeterminate"
            data-slot="progress-content"
            class="absolute start-0 top-0 h-full rounded-full bg-(--progress-content-bg) transition-[width] duration-200 ease-linear will-change-[width] motion-reduce:transition-none forced-colors:bg-[Highlight]"
            :style="{ width: `${percentage}%` }"
          />
          <div
            v-else
            data-slot="progress-content"
            class="absolute top-0 h-full animate-[progress-slide_2000ms_ease-in-out_infinite] rounded-full bg-(--progress-content-bg) forced-colors:bg-[Highlight]"
            style="width: 40%"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes progress-slide {
  0% {
    inset-inline-start: 0%;
  }
  50% {
    inset-inline-start: 100%;
  }
  100% {
    inset-inline-start: 0%;
  }
}
</style>
