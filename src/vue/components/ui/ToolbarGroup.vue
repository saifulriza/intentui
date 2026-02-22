<script setup lang="ts">
import { provide, toRef } from "vue"

const props = defineProps<{
  disabled?: boolean
}>()

provide("intent-toolbar-group", {
  disabled: toRef(props, "disabled"),
})
</script>

<template>
  <div
    data-slot="toolbar-group"
    :data-disabled="disabled ? true : undefined"
    class="flex gap-1.5 group-orientation-vertical:flex-col group-orientation-vertical:items-start group-orientation-horizontal:items-center"
  >
    <slot />
  </div>
</template>
