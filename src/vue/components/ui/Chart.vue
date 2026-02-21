<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string
    description?: string
  }>(),
  {
    title: undefined,
    description: undefined,
  },
)
</script>

<template>
  <div data-slot="chart" class="rounded-xl border border-border bg-bg p-4">
    <div v-if="title || description" class="mb-4">
      <h3 v-if="title" class="font-medium text-fg text-sm">{{ title }}</h3>
      <p v-if="description" class="mt-1 text-muted-fg text-xs">{{ description }}</p>
    </div>
    <slot />
  </div>
</template>
