<script setup lang="ts">
import { computed } from "vue"

const props = withDefaults(
  defineProps<{
    orientation?: "horizontal" | "vertical"
  }>(),
  {
    orientation: "horizontal",
  },
)

const classes = computed(() =>
  [
    "shrink-0 border-0 bg-border forced-colors:bg-[ButtonBorder]",
    props.orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
  ].join(" "),
)
</script>

<template>
  <div :class="classes" aria-hidden="true" />
</template>
