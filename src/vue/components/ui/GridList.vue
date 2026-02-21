<script setup lang="ts">
import { computed } from "vue"

type GridListItem = {
  key: string
  label: string
  description?: string
  disabled?: boolean
}

const props = withDefaults(
  defineProps<{
    modelValue?: string | string[]
    items?: GridListItem[]
    selectionMode?: "single" | "multiple" | "none"
  }>(),
  {
    modelValue: "",
    items: () => [],
    selectionMode: "none",
  },
)

const emit = defineEmits<{
  "update:modelValue": [value: string | string[]]
}>()

const selectedSet = computed(() =>
  new Set(Array.isArray(props.modelValue) ? props.modelValue : [props.modelValue]),
)

const onSelect = (item: GridListItem) => {
  if (item.disabled || props.selectionMode === "none") return
  if (props.selectionMode === "single") {
    emit("update:modelValue", item.key)
    return
  }
  const next = new Set(selectedSet.value)
  if (next.has(item.key)) next.delete(item.key)
  else next.add(item.key)
  emit("update:modelValue", Array.from(next))
}
</script>

<template>
  <div
    data-slot="grid-list"
    class="relative flex flex-col gap-y-1 sm:text-sm/6"
    :role="selectionMode === 'none' ? undefined : 'listbox'"
    :aria-multiselectable="selectionMode === 'multiple' ? true : undefined"
  >
    <button
      v-for="item in items"
      :key="item.key"
      type="button"
      data-slot="grid-list-item"
      :disabled="item.disabled"
      :aria-selected="selectionMode === 'none' ? undefined : selectedSet.has(item.key)"
      class="group inset-ring inset-ring-border relative flex min-w-0 items-center gap-2 rounded-lg px-3 py-2.5 text-left outline-hidden"
      :class="[
        selectedSet.has(item.key)
          ? 'inset-ring-ring/70 bg-primary-subtle text-primary-subtle-fg'
          : 'hover:bg-primary-subtle/40',
        item.disabled ? 'bg-muted opacity-50' : '',
      ]"
      @click="onSelect(item)"
    >
      <span class="min-w-0 flex-1">
        <span class="block font-medium">{{ item.label }}</span>
        <span v-if="item.description" class="block text-muted-fg text-sm">{{ item.description }}</span>
      </span>
      <span v-if="selectionMode === 'multiple'" class="ps-1">
        <input
          type="checkbox"
          :checked="selectedSet.has(item.key)"
          aria-hidden="true"
          tabindex="-1"
          class="size-4 accent-primary"
          :disabled="item.disabled"
          readonly
        />
      </span>
    </button>
    <slot />
  </div>
</template>
