<script setup lang="ts">
defineProps<{
  href?: string
  target?: string
  rel?: string
  ariaDisabled?: boolean
}>()
</script>

<template>
  <a
    :href="href"
    :target="target"
    :rel="rel"
    :aria-disabled="ariaDisabled || undefined"
    :tabindex="ariaDisabled ? -1 : undefined"
    class="font-medium text-(--text) outline-0 outline-offset-2 focus-visible:outline-2 focus-visible:outline-ring forced-colors:outline-[Highlight] disabled:cursor-default disabled:opacity-50 forced-colors:disabled:text-[GrayText]"
    :class="href ? 'cursor-pointer' : ''"
    @click="ariaDisabled && $event.preventDefault()"
  >
    <slot />
  </a>
</template>
