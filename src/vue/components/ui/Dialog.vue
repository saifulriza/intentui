<script setup lang="ts">
import { computed, getCurrentInstance } from "vue"

const props = withDefaults(
  defineProps<{
    role?: "dialog" | "alertdialog"
    title?: string
    description?: string
    dismissable?: boolean
  }>(),
  {
    role: "dialog",
    dismissable: true,
  },
)

const emits = defineEmits<{
  close: []
}>()
const instance = getCurrentInstance()
const titleId = `dialog-title-${instance?.uid ?? crypto.randomUUID()}`

const rootClasses = computed(() =>
  [
    "peer/dialog group/dialog relative flex flex-col overflow-hidden outline-hidden",
    "max-h-[90vh]",
  ].join(" "),
)
</script>

<template>
  <div
    data-slot="dialog"
    :role="role"
    :aria-labelledby="title ? titleId : undefined"
    :aria-label="title ? undefined : 'Dialog'"
    :class="rootClasses"
  >
    <div
      v-if="title || description || $slots.header"
      data-slot="dialog-header"
      class="relative space-y-1 p-6 pb-3 sm:p-8 sm:pb-3"
    >
      <slot name="header">
        <h2
          v-if="title"
          :id="titleId"
          data-slot="title"
          class="text-balance font-semibold text-fg text-lg/6 sm:text-base/6"
        >
          {{ title }}
        </h2>
        <p
          v-if="description"
          data-slot="description"
          class="text-pretty text-base/6 text-muted-fg group-disabled:opacity-50 sm:text-sm/6"
        >
          {{ description }}
        </p>
      </slot>
      <button
        v-if="dismissable"
        aria-label="Close"
        data-slot="dialog-close-icon"
        class="close absolute end-1 top-1 z-50 grid size-8 place-content-center rounded-xl hover:bg-secondary focus:bg-secondary focus:outline-hidden focus-visible:ring-1 focus-visible:ring-primary sm:end-2 sm:top-2 sm:size-7 sm:rounded-md"
        @click="emits('close')"
      >
        <svg aria-hidden="true" viewBox="0 0 20 20" class="size-4 fill-current">
          <path
            fill-rule="evenodd"
            d="M4.22 4.22a.75.75 0 0 1 1.06 0L10 8.94l4.72-4.72a.75.75 0 1 1 1.06 1.06L11.06 10l4.72 4.72a.75.75 0 1 1-1.06 1.06L10 11.06l-4.72 4.72a.75.75 0 0 1-1.06-1.06L8.94 10 4.22 5.28a.75.75 0 0 1 0-1.06Z"
            clip-rule="evenodd"
          />
        </svg>
        <span class="sr-only">Close</span>
      </button>
    </div>

    <div
      v-if="$slots.default"
      data-slot="dialog-body"
      class="isolate flex min-h-0 flex-1 flex-col overflow-auto px-6 py-1 sm:px-8"
    >
      <slot />
    </div>

    <div
      v-if="$slots.footer"
      data-slot="dialog-footer"
      class="isolate mt-auto flex flex-col-reverse justify-end gap-3 p-6 pt-4 sm:flex-row sm:p-8 sm:pt-4"
    >
      <slot name="footer" />
    </div>
  </div>
</template>
