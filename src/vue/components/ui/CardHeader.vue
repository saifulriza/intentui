<script setup lang="ts">
import CardDescription from "./CardDescription.vue"
import CardTitle from "./CardTitle.vue"

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
    <CardTitle v-if="title">{{ title }}</CardTitle>
    <CardDescription v-if="description">{{ description }}</CardDescription>
    <slot />
  </div>
</template>
