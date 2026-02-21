<script setup lang="ts">
import { ref, watch } from "vue"

type DisclosureItem = {
  id: string
  title: string
  content?: string
  disabled?: boolean
}

const props = withDefaults(
  defineProps<{
    modelValue?: string | null
    items?: DisclosureItem[]
    collapsible?: boolean
  }>(),
  {
    modelValue: null,
    items: () => [],
    collapsible: true,
  },
)

const emit = defineEmits<{
  "update:modelValue": [value: string | null]
}>()

const activeId = ref<string | null>(props.modelValue)

watch(
  () => props.modelValue,
  (value) => {
    activeId.value = value
  },
)

const toggle = (item: DisclosureItem) => {
  if (item.disabled) return
  if (activeId.value === item.id && props.collapsible) {
    activeId.value = null
    emit("update:modelValue", null)
    return
  }
  activeId.value = item.id
  emit("update:modelValue", item.id)
}
</script>

<template>
  <div data-slot="disclosure-group" class="flex flex-col gap-y-2">
    <article
      v-for="item in items"
      :key="item.id"
      class="rounded-lg inset-ring inset-ring-border bg-bg transition-colors"
      :class="{
        'bg-secondary/20 inset-ring-muted-fg/30': activeId === item.id,
        'opacity-50': item.disabled,
      }"
    >
      <button
        type="button"
        class="flex w-full items-center justify-between px-4 py-3 text-left font-medium text-sm/6"
        :disabled="item.disabled"
        :aria-expanded="activeId === item.id ? 'true' : 'false'"
        @click="toggle(item)"
      >
        <span>{{ item.title }}</span>
        <svg
          viewBox="0 0 20 20"
          fill="currentColor"
          class="ms-4 size-4 transition-transform"
          :class="{ 'rotate-180': activeId === item.id }"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.127l3.71-3.897a.75.75 0 1 1 1.08 1.04l-4.25 4.462a.75.75 0 0 1-1.08 0L5.21 8.27a.75.75 0 0 1 .02-1.06Z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
      <div v-if="activeId === item.id" data-slot="disclosure-panel" class="px-4 pb-4 text-sm/6 text-muted-fg">
        <slot :item="item">{{ item.content }}</slot>
      </div>
    </article>
  </div>
</template>
