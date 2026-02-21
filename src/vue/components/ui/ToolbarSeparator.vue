<script setup lang="ts">
import { computed, inject } from "vue"
import Separator from "./Separator.vue"

const toolbar = inject<{ orientation: { value: "horizontal" | "vertical" } } | null>(
  "intent-toolbar",
  null,
)

const orientation = computed(() =>
  (toolbar?.orientation?.value ?? "horizontal") === "vertical" ? "horizontal" : "vertical",
)
</script>

<template>
  <Separator :orientation="orientation" :class="orientation === 'vertical' ? 'mx-0.5 h-6' : 'my-0.5 w-8'" />
</template>
