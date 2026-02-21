<script setup lang="ts">
defineProps<{
  title?: string
  description?: string
}>()
</script>

<template>
  <div
    data-slot="card-header"
    class="grid auto-rows-min grid-rows-[auto_auto] items-start gap-1 px-(--gutter) has-data-[slot=card-action]:grid-cols-[1fr_auto]"
  >
    <div v-if="title" data-slot="card-title" class="text-balance font-semibold text-base/6">{{ title }}</div>
    <div v-if="description" data-slot="card-description" class="row-start-2 text-pretty text-muted-fg text-sm/6">
      {{ description }}
    </div>
    <slot />
  </div>
</template>
