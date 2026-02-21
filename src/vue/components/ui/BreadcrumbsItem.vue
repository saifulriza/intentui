<script setup lang="ts">
import { computed, inject } from "vue"
import Link from "./Link.vue"

const props = withDefaults(
  defineProps<{
    href?: string
    current?: boolean
    separator?: "chevron" | "slash" | boolean
  }>(),
  {
    current: false,
    separator: true,
  },
)

const context = inject<{ separator: { value: "chevron" | "slash" | boolean } } | null>(
  "intent-breadcrumbs",
  null,
)

const separatorValue = computed(() => {
  const value = context?.separator.value ?? props.separator
  return value === true ? "chevron" : value
})
</script>

<template>
  <li data-slot="breadcrumb-item" class="flex items-center gap-2 text-sm">
    <Link
      :href="href"
      :aria-current="current ? 'page' : undefined"
      class="has-data-[slot=icon]:inline-flex has-data-[slot=icon]:items-center has-data-[slot=icon]:gap-x-2 *:data-[slot=icon]:size-5 sm:*:data-[slot=icon]:size-4 *:data-[slot=icon]:text-muted-fg hover:*:data-[slot=icon]:text-fg"
    >
      <slot />
    </Link>
    <span v-if="!current && separatorValue !== false" class="*:shrink-0 *:text-muted-fg *:data-[slot=icon]:size-3.5">
      <svg
        v-if="separatorValue === 'chevron'"
        data-slot="icon"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fill-rule="evenodd"
          d="M8.22 4.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 1 1-1.06-1.06L11.94 9 8.22 5.28a.75.75 0 0 1 0-1.06Z"
          clip-rule="evenodd"
        />
      </svg>
      <span v-else-if="separatorValue === 'slash'" class="text-muted-fg">/</span>
    </span>
  </li>
</template>
