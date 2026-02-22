<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue"

type ComboItem = {
  key: string
  label: string
  description?: string
  disabled?: boolean
}

const props = withDefaults(
  defineProps<{
    modelValue?: string
    items?: ComboItem[]
    placeholder?: string
    disabled?: boolean
  }>(),
  {
    modelValue: "",
    items: () => [],
    placeholder: "Search or select...",
    disabled: false,
  },
)

const emit = defineEmits<{
  "update:modelValue": [value: string]
}>()

const root = ref<HTMLElement | null>(null)
const open = ref(false)
const query = ref("")
const highlightedIndex = ref(-1)

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return props.items
  return props.items.filter(
    (item) => item.label.toLowerCase().includes(q) || (item.description ?? "").toLowerCase().includes(q),
  )
})
const enabledItems = computed(() => filtered.value.filter((item) => !item.disabled))
const enabledIndexMap = computed(() => {
  const map = new Map<string, number>()
  enabledItems.value.forEach((item, index) => map.set(item.key, index))
  return map
})
const highlightedKey = computed(
  () =>
    (highlightedIndex.value >= 0 && highlightedIndex.value < enabledItems.value.length
      ? enabledItems.value[highlightedIndex.value].key
      : "") as string,
)

const selected = computed(() => props.items.find((item) => item.key === props.modelValue))

const selectItem = (item: ComboItem) => {
  if (item.disabled) return
  emit("update:modelValue", item.key)
  query.value = item.label
  open.value = false
}

const onInput = (event: Event) => {
  query.value = (event.target as HTMLInputElement).value
  open.value = true
}

const onOutside = (event: MouseEvent) => {
  if (!open.value) return
  if (!root.value?.contains(event.target as Node)) open.value = false
}
onMounted(() => document.addEventListener("mousedown", onOutside))
onBeforeUnmount(() => document.removeEventListener("mousedown", onOutside))

const onKeydown = (event: KeyboardEvent) => {
  const enabled = enabledItems.value
  if (!enabled.length) return
  if (event.key === "Escape") {
    open.value = false
    return
  }
  if (event.key === "ArrowDown") {
    event.preventDefault()
    open.value = true
    highlightedIndex.value = (highlightedIndex.value + 1) % enabled.length
  }
  if (event.key === "ArrowUp") {
    event.preventDefault()
    open.value = true
    highlightedIndex.value = (highlightedIndex.value - 1 + enabled.length) % enabled.length
  }
  if (
    event.key === "Enter" &&
    open.value &&
    highlightedIndex.value >= 0 &&
    highlightedIndex.value < enabled.length
  ) {
    event.preventDefault()
    selectItem(enabled[highlightedIndex.value])
  }
}
</script>

<template>
  <div ref="root" data-slot="combo-box" class="relative block w-full">
    <div data-slot="control" class="relative block has-[[data-slot=icon]:last-child]:[&_input]:pe-10">
      <input
        type="text"
        :value="query || selected?.label || ''"
        :placeholder="placeholder"
        :disabled="disabled"
        class="w-full rounded-lg border border-input px-3 py-2 text-base/6 text-fg outline-hidden sm:text-sm/6"
        @focus="open = true"
        @input="onInput"
        @keydown="onKeydown"
      />
      <button
        type="button"
        aria-label="Toggle dropdown"
        class="absolute end-0 top-0 grid h-full w-11 place-content-center text-muted-fg sm:w-9"
        :disabled="disabled"
        @click="open = !open"
      >
        <span aria-hidden="true">⌄</span>
      </button>
    </div>
    <div
      v-if="open"
      class="absolute left-0 top-full z-50 mt-2 min-w-full rounded-xl bg-overlay p-1 shadow-xs ring ring-muted-fg/20"
      role="listbox"
    >
      <button
        v-for="item in filtered"
        :key="item.key"
        type="button"
        role="option"
        :aria-selected="modelValue === item.key"
        :disabled="item.disabled"
        class="grid w-full grid-cols-[1fr_auto] rounded-lg px-2.5 py-1.5 text-left text-sm/6"
        :class="[
          modelValue === item.key || highlightedKey === item.key
            ? 'bg-accent text-accent-fg'
            : 'hover:bg-accent hover:text-accent-fg',
          item.disabled ? 'opacity-50' : '',
        ]"
        @click="selectItem(item)"
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
