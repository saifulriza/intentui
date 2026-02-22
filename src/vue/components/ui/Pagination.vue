<script setup lang="ts">
import { computed } from "vue"

const props = withDefaults(
  defineProps<{
    page?: number
    totalPages?: number
    disabled?: boolean
  }>(),
  {
    page: 1,
    totalPages: 1,
    disabled: false,
  },
)

const emit = defineEmits<{
  "update:page": [value: number]
}>()

const currentPage = computed(() => Math.max(1, Math.min(props.page, props.totalPages)))
const pages = computed<(number | string)[]>(() => {
  if (props.totalPages <= 7) return Array.from({ length: props.totalPages }, (_, i) => i + 1)

  const current = currentPage.value
  const start = Math.max(2, current - 1)
  const end = Math.min(props.totalPages - 1, current + 1)

  const result: (number | string)[] = [1]
  if (start > 2) result.push("start-ellipsis")
  for (let i = start; i <= end; i++) result.push(i)
  if (end < props.totalPages - 1) result.push("end-ellipsis")
  result.push(props.totalPages)
  return result
})

const goTo = (value: number) => {
  if (props.disabled) return
  if (value < 1 || value > props.totalPages) return
  emit("update:page", value)
}
</script>

<template>
  <nav
    data-slot="pagination"
    aria-label="pagination"
    class="mx-auto flex w-full items-center justify-center gap-2"
  >
    <button
      type="button"
      aria-label="First page"
      class="rounded-md border px-2 py-1 text-sm disabled:opacity-50"
      :disabled="disabled || currentPage <= 1"
      @click="goTo(1)"
    >
      «
    </button>
    <button
      type="button"
      aria-label="Previous page"
      class="rounded-md border px-2 py-1 text-sm disabled:opacity-50"
      :disabled="disabled || currentPage <= 1"
      @click="goTo(currentPage - 1)"
    >
      ‹
    </button>

    <ul data-slot="pagination-list" class="flex gap-1">
      <li v-for="item in pages" :key="item">
        <span
          v-if="typeof item !== 'number'"
          data-slot="pagination-gap"
          class="inline-flex min-w-9 items-center justify-center px-2 py-1 text-sm font-semibold"
          aria-hidden="true"
        >
          &hellip;
        </span>
        <button
          v-else
          type="button"
          data-slot="pagination-item"
          :aria-current="item === currentPage ? 'page' : undefined"
          class="min-w-9 rounded-md border px-2 py-1 text-sm"
          :class="item === currentPage ? 'bg-secondary font-medium' : 'hover:bg-secondary/50'"
          :disabled="disabled"
          @click="goTo(item)"
        >
          {{ item }}
        </button>
      </li>
    </ul>

    <button
      type="button"
      aria-label="Next page"
      class="rounded-md border px-2 py-1 text-sm disabled:opacity-50"
      :disabled="disabled || currentPage >= totalPages"
      @click="goTo(currentPage + 1)"
    >
      ›
    </button>
    <button
      type="button"
      aria-label="Last page"
      class="rounded-md border px-2 py-1 text-sm disabled:opacity-50"
      :disabled="disabled || currentPage >= totalPages"
      @click="goTo(totalPages)"
    >
      »
    </button>
  </nav>
</template>
