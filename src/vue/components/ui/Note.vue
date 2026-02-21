<script setup lang="ts">
import { computed } from "vue"

const props = withDefaults(
  defineProps<{
    intent?: "default" | "info" | "warning" | "danger" | "success"
    indicator?: boolean
  }>(),
  {
    intent: "default",
    indicator: true,
  },
)

const classes = computed(() =>
  [
    "grid w-full grid-cols-[auto_1fr] overflow-hidden rounded-lg border border-current/15 p-4 text-base/6 backdrop-blur-2xl sm:text-sm/6",
    props.intent === "default" && "bg-muted/50 text-secondary-fg",
    props.intent === "info" && "bg-info-subtle text-info-subtle-fg **:[.text-muted-fg]:text-info-subtle-fg/70",
    props.intent === "warning" &&
      "bg-warning-subtle text-warning-subtle-fg **:[.text-muted-fg]:text-warning-subtle-fg/80",
    props.intent === "danger" &&
      "bg-danger-subtle text-danger-subtle-fg **:[.text-muted-fg]:text-danger-subtle-fg/80",
    props.intent === "success" &&
      "bg-success-subtle text-success-subtle-fg **:[.text-muted-fg]:text-success-subtle-fg/80",
  ]
    .filter(Boolean)
    .join(" "),
)

const symbol = computed(() => {
  if (!props.indicator || props.intent === "default") return null
  if (props.intent === "success") return "✓"
  if (props.intent === "info") return "i"
  return "!"
})
</script>

<template>
  <div data-slot="note" :class="classes">
    <div
      v-if="symbol"
      class="me-3 grid size-8 place-content-center rounded-full border-2 border-current/40"
      aria-hidden="true"
    >
      <div class="grid size-6 place-content-center rounded-full border-2 border-current/85 text-sm">
        {{ symbol }}
      </div>
    </div>
    <div class="text-pretty group-has-data-[slot=icon]:col-start-2">
      <slot />
    </div>
  </div>
</template>
