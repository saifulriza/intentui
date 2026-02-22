<script setup lang="ts">
import { onBeforeUnmount, watch } from "vue"

type ToastItem = {
  id: string | number
  title: string
  description?: string
  tone?: "default" | "success" | "error" | "warning" | "info"
}

const props = withDefaults(
  defineProps<{
    modelValue?: ToastItem[]
    duration?: number
  }>(),
  {
    modelValue: () => [],
    duration: 4000,
  },
)

const emit = defineEmits<{
  "update:modelValue": [value: ToastItem[]]
}>()

const timers = new Map<ToastItem["id"], ReturnType<typeof setTimeout>>()

const clearToastTimer = (id: ToastItem["id"]) => {
  const timer = timers.get(id)
  if (!timer) return
  clearTimeout(timer)
  timers.delete(id)
}

const removeToast = (id: ToastItem["id"]) => {
  clearToastTimer(id)
  emit(
    "update:modelValue",
    props.modelValue.filter((item) => item.id !== id),
  )
}

watch(
  () => props.modelValue,
  (items) => {
    for (const toast of items) {
      if (timers.has(toast.id)) continue
      timers.set(toast.id, setTimeout(() => removeToast(toast.id), props.duration))
    }
    for (const id of timers.keys()) {
      if (items.some((item) => item.id === id)) continue
      clearToastTimer(id)
    }
  },
  { immediate: true, deep: true },
)

watch(
  () => props.duration,
  () => {
    for (const id of timers.keys()) clearToastTimer(id)
    for (const toast of props.modelValue) {
      timers.set(toast.id, setTimeout(() => removeToast(toast.id), props.duration))
    }
  },
)

onBeforeUnmount(() => {
  for (const id of timers.keys()) clearToastTimer(id)
})
</script>

<template>
  <div
    data-slot="toast"
    role="region"
    aria-label="Notifications"
    aria-live="polite"
    aria-atomic="false"
    class="fixed right-4 bottom-4 z-50 grid w-full max-w-sm gap-2"
  >
    <article
      v-for="item in modelValue"
      :key="item.id"
      class="rounded-xl border p-3 shadow-sm backdrop-blur-sm"
      :class="{
        'bg-overlay text-overlay-fg': !item.tone || item.tone === 'default',
        'bg-success-subtle text-success-subtle-fg': item.tone === 'success',
        'bg-danger-subtle text-danger-subtle-fg': item.tone === 'error',
        'bg-warning-subtle text-warning-subtle-fg': item.tone === 'warning',
        'bg-info-subtle text-info-subtle-fg': item.tone === 'info',
      }"
    >
      <div class="flex items-start gap-3">
        <div class="min-w-0 flex-1">
          <div class="font-medium text-sm/5">{{ item.title }}</div>
          <p v-if="item.description" class="mt-1 text-sm/5 opacity-90">{{ item.description }}</p>
        </div>
        <button
          type="button"
          class="rounded-md p-1 text-sm/5 opacity-80 hover:opacity-100"
          :aria-label="`Dismiss ${item.title} notification`"
          @click="removeToast(item.id)"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" class="size-4" aria-hidden="true">
            <path
              fill-rule="evenodd"
              d="M4.22 4.22a.75.75 0 0 1 1.06 0L10 8.94l4.72-4.72a.75.75 0 1 1 1.06 1.06L11.06 10l4.72 4.72a.75.75 0 1 1-1.06 1.06L10 11.06l-4.72 4.72a.75.75 0 0 1-1.06-1.06L8.94 10 4.22 5.28a.75.75 0 0 1 0-1.06Z"
              clip-rule="evenodd"
            />
          </svg>
          <span class="sr-only">Dismiss</span>
        </button>
      </div>
    </article>
    <slot />
  </div>
</template>
