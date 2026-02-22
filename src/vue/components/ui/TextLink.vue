<script setup lang="ts">
import Link from "./Link.vue"

defineProps<{
  href?: string
  target?: string
  rel?: string
  ariaDisabled?: boolean
}>()
</script>

<template>
  <Link
    :href="href"
    :target="target"
    :rel="rel"
    :aria-disabled="ariaDisabled"
    class="text-primary-subtle-fg decoration-primary-subtle-fg/50 hover:underline hover:decoration-primary-subtle-fg has-data-[slot=icon]:inline-flex has-data-[slot=icon]:items-center has-data-[slot=icon]:gap-x-1"
  >
    <slot />
  </Link>
</template>
