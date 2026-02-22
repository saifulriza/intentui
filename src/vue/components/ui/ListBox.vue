<script setup lang="ts">
import { computed, ref } from "vue"

type ListBoxItemType = {
  key: string
  label: string
  description?: string
  disabled?: boolean
}

const props = withDefaults(
  defineProps<{
    modelValue?: string | string[]
    items?: ListBoxItemType[]
    selectionMode?: "single" | "multiple"
  }>(),
  {
    modelValue: "",
    items: () => [],
    selectionMode: "single",
  },
)

const emit = defineEmits<{
  "update:modelValue": [value: string | string[]]
}>()

const highlightedIndex = ref(0)
const enabledItems = computed(() => props.items.filter((item) => !item.disabled))
const selectedKeys = computed(() =>
  Array.isArray(props.modelValue) ? new Set(props.modelValue) : new Set([props.modelValue]),
)
const itemBaseClass =
  "col-span-full grid grid-cols-[1fr_auto] rounded-lg px-2.5 py-1.5 text-left text-sm/6"

const choose = (key: string) => {
  const item = props.items.find((entry) => entry.key === key)
  if (item?.disabled) return
  if (props.selectionMode === "single") {
    emit("update:modelValue", key)
    return
  }
  const next = new Set(selectedKeys.value)
  if (next.has(key)) next.delete(key)
  else next.add(key)
  emit("update:modelValue", Array.from(next))
}

const onKeydown = (event: KeyboardEvent) => {
  const enabled = enabledItems.value
  if (!enabled.length) return
  if (event.key === "ArrowDown") {
    event.preventDefault()
    highlightedIndex.value = (highlightedIndex.value + 1) % enabled.length
  } else if (event.key === "ArrowUp") {
    event.preventDefault()
    highlightedIndex.value = (highlightedIndex.value - 1 + enabled.length) % enabled.length
  } else if (event.key === "Enter" || event.key === " ") {
    event.preventDefault()
    if (highlightedIndex.value >= 0) {
      choose(enabled[highlightedIndex.value].key)
    }
  }
}
</script>

<template>
  <div
    data-slot="list-box"
    class="grid max-h-96 w-full min-w-56 grid-cols-[auto_1fr] gap-y-1 overflow-y-auto overscroll-contain rounded-xl border bg-bg p-1 outline-hidden"
    role="listbox"
    tabindex="0"
    @keydown="onKeydown"
  >
    <button
      v-for="item in items"
      :key="item.key"
      type="button"
      role="option"
      :aria-selected="selectedKeys.has(item.key)"
      :disabled="item.disabled"
      :class="[
          itemBaseClass,
          selectedKeys.has(item.key)
            ? 'bg-primary-subtle text-primary-subtle-fg'
            : enabledItems[highlightedIndex]?.key === item.key
              ? 'bg-accent text-accent-fg'
              : 'hover:bg-accent hover:text-accent-fg',
          item.disabled ? 'opacity-50' : '',
        ]"
        @mouseenter="highlightedIndex = enabledItems.findIndex((x) => x.key === item.key)"
        @click="choose(item.key)"
      >
      <span>
        <span class="block">{{ item.label }}</span>
        <span v-if="item.description" class="block text-xs text-muted-fg">{{ item.description }}</span>
      </span>
      <svg
        v-if="selectedKeys.has(item.key)"
        aria-hidden="true"
        viewBox="0 0 20 20"
        class="size-4 fill-current"
      >
        <path
          fill-rule="evenodd"
          d="M16.704 5.29a.75.75 0 0 1 .006 1.06l-7.25 7.333a.75.75 0 0 1-1.075-.01l-3.084-3.25a.75.75 0 1 1 1.088-1.034l2.551 2.689 6.72-6.8a.75.75 0 0 1 1.044.012Z"
          clip-rule="evenodd"
        />
      </svg>
    </button>
  </div>
</template>
