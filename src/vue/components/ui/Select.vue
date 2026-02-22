<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue"

type SelectItem = {
  key: string
  label: string
  description?: string
  disabled?: boolean
}

const props = withDefaults(
  defineProps<{
    modelValue?: string
    items?: SelectItem[]
    placeholder?: string
    disabled?: boolean
  }>(),
  {
    modelValue: "",
    items: () => [],
    placeholder: "Select item",
    disabled: false,
  },
)

const emit = defineEmits<{
  "update:modelValue": [value: string]
}>()

const open = ref(false)
const highlightedIndex = ref(-1)
const root = ref<HTMLElement | null>(null)
const enabledItems = computed(() => props.items.filter((item) => !item.disabled))

const selected = () => props.items.find((item) => item.key === props.modelValue)

const close = () => (open.value = false)
const toggle = () => {
  if (!props.disabled) open.value = !open.value
  if (!open.value) highlightedIndex.value = -1
}
const choose = (key: string) => {
  const item = props.items.find((entry) => entry.key === key)
  if (item?.disabled) return
  emit("update:modelValue", key)
  close()
}

const onOutside = (event: MouseEvent) => {
  if (!open.value) return
  if (!root.value?.contains(event.target as Node)) close()
}
onMounted(() => document.addEventListener("mousedown", onOutside))
onBeforeUnmount(() => document.removeEventListener("mousedown", onOutside))

const onKeydown = (event: KeyboardEvent) => {
  const items = enabledItems.value
  if (!items.length) return
  if (!open.value && (event.key === "ArrowDown" || event.key === "ArrowUp")) {
    event.preventDefault()
    open.value = true
    highlightedIndex.value = 0
    return
  }
  if (event.key === "Escape") {
    close()
    return
  }
  if (event.key === "ArrowDown") {
    event.preventDefault()
    highlightedIndex.value = (highlightedIndex.value + 1) % items.length
  }
  if (event.key === "ArrowUp") {
    event.preventDefault()
    highlightedIndex.value = (highlightedIndex.value - 1 + items.length) % items.length
  }
  if (event.key === "Enter" || event.key === " ") {
    if (!open.value) return
    event.preventDefault()
    if (highlightedIndex.value >= 0) {
      choose(items[highlightedIndex.value].key)
    }
  }
}
</script>

<template>
  <div ref="root" data-slot="select" class="relative block w-full">
    <button
      type="button"
      data-slot="select-trigger"
      class="group/select-trigger flex w-full min-w-0 items-center gap-x-2 rounded-lg border border-input px-3 py-2 text-start text-fg outline-hidden sm:text-sm/6"
      :class="disabled ? 'bg-muted opacity-50' : 'hover:border-muted-fg/30 focus:border-ring/70 focus:ring-3 focus:ring-ring/20'"
      :disabled="disabled"
      @click="toggle"
      @keydown="onKeydown"
    >
      <span class="truncate text-start" :class="selected() ? '' : 'text-muted-fg'">
        {{ selected()?.label ?? placeholder }}
      </span>
      <svg aria-hidden="true" viewBox="0 0 20 20" class="ms-auto size-4 text-muted-fg fill-current">
        <path
          fill-rule="evenodd"
          d="M5.22 7.22a.75.75 0 0 1 1.06 0L10 10.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 8.28a.75.75 0 0 1 0-1.06Z"
          clip-rule="evenodd"
        />
      </svg>
    </button>

    <div
      v-if="open"
      data-slot="select-content"
      class="absolute left-0 top-full z-50 mt-2 min-w-full rounded-xl bg-overlay p-1 shadow-xs ring ring-muted-fg/20"
      role="listbox"
    >
      <button
        v-for="item in items"
        :key="item.key"
        type="button"
        role="option"
        :aria-selected="modelValue === item.key"
        :disabled="item.disabled"
        class="grid w-full grid-cols-[1fr_auto] rounded-lg px-2.5 py-1.5 text-start text-sm/6"
        :class="[
          modelValue === item.key || enabledItems[highlightedIndex]?.key === item.key
            ? 'bg-accent text-accent-fg'
            : 'hover:bg-accent hover:text-accent-fg',
          item.disabled ? 'opacity-50' : '',
        ]"
        @mouseenter="highlightedIndex = enabledItems.findIndex((x) => x.key === item.key)"
        @click="choose(item.key)"
      >
        <span>
          {{ item.label }}
          <span v-if="item.description" class="block text-xs text-muted-fg">{{ item.description }}</span>
        </span>
        <span v-if="modelValue === item.key">✓</span>
      </button>
    </div>
  </div>
</template>
