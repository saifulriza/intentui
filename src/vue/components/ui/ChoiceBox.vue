<script setup lang="ts">
import { computed } from "vue"

type ChoiceItem = {
  key: string
  label: string
  description?: string
  disabled?: boolean
}

const props = withDefaults(
  defineProps<{
    modelValue?: string | string[]
    items?: ChoiceItem[]
    selectionMode?: "single" | "multiple"
    columns?: 1 | 2 | 3 | 4 | 5 | 6
    gap?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12
    readOnly?: boolean
  }>(),
  {
    modelValue: "",
    items: () => [],
    selectionMode: "single",
    columns: 1,
    gap: 0,
    readOnly: false,
  },
)

const emit = defineEmits<{
  "update:modelValue": [value: string | string[]]
}>()

const selectedSet = computed(() =>
  new Set(Array.isArray(props.modelValue) ? props.modelValue : [props.modelValue]),
)

const gridClass = computed(() => {
  const col =
    props.columns === 1
      ? "grid-cols-[auto_1fr]"
      : props.columns === 2
        ? "sm:grid-cols-2"
        : props.columns === 3
          ? "sm:grid-cols-3"
          : props.columns === 4
            ? "sm:grid-cols-4"
            : props.columns === 5
              ? "sm:grid-cols-5"
              : "sm:grid-cols-6"
  const gap =
    props.gap === 0
      ? "gap-0"
      : props.gap === 1
        ? "gap-1"
        : props.gap === 2
          ? "gap-2"
          : props.gap === 3
            ? "gap-3"
            : props.gap === 4
              ? "gap-4"
              : props.gap === 5
                ? "gap-5"
                : props.gap === 6
                  ? "gap-6"
                  : props.gap === 8
                    ? "gap-8"
                    : props.gap === 10
                      ? "gap-10"
                      : "gap-12"
  return ["grid", col, gap].join(" ")
})

const toggle = (item: ChoiceItem) => {
  if (item.disabled || props.readOnly) return
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
  <div data-slot="choice-box" :class="gridClass">
    <button
      v-for="item in items"
      :key="item.key"
      type="button"
      data-slot="choice-box-item"
      class="group grid content-start items-start gap-x-3 gap-y-1 rounded-lg p-4 text-left inset-ring inset-ring-border"
      :class="[
        selectedSet.has(item.key)
          ? 'bg-primary-subtle text-primary-subtle-fg inset-ring-ring/70 ring-3 ring-ring/20'
          : 'hover:inset-ring-muted-fg/30',
        item.disabled ? 'opacity-50' : '',
        props.columns === 1 ? 'col-span-full' : '',
      ]"
      :disabled="item.disabled"
      @click="toggle(item)"
    >
      <span data-slot="label" class="font-medium text-base/6 sm:text-sm/6">{{ item.label }}</span>
      <span v-if="item.description" data-slot="description" class="text-base/6 text-muted-fg sm:text-sm/6">
        {{ item.description }}
      </span>
      <span v-if="selectionMode === 'multiple'" class="ms-auto row-span-2 self-start">
        <input
          type="checkbox"
          :checked="selectedSet.has(item.key)"
          class="size-4 accent-primary"
          :disabled="item.disabled"
          @change.prevent
        />
      </span>
    </button>
  </div>
</template>
