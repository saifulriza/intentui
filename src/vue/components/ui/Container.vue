<script setup lang="ts">
import { computed } from "vue"

const props = withDefaults(
  defineProps<{
    constrained?: boolean
  }>(),
  {
    constrained: false,
  },
)

const classes = computed(() =>
  [
    "mx-auto w-full max-w-(--container-breakpoint) [--container-breakpoint:var(--breakpoint-xl)] [--container-padding:--spacing(4)]",
    props.constrained ? "sm:px-(--container-padding)" : "px-(--container-padding)",
  ].join(" "),
)
</script>

<template>
  <div :class="classes">
    <slot />
  </div>
</template>
