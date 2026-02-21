<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue"

type OptionItem = {
  key: string
  label: string
  description?: string
  disabled?: boolean
}

const props = withDefaults(
  defineProps<{
    modelValue?: string[]
    items?: OptionItem[]
    placeholder?: string
    disabled?: boolean
  }>(),
  {
    modelValue: () => [],
    items: () => [],
    placeholder: "No selected items",
    disabled: false,
  },
)

const emit = defineEmits<{
  "update:modelValue": [value: string[]]
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
const enabledFiltered = computed(() => filtered.value.filter((item) => !item.disabled))

const selectedItems = computed(() =>
  props.items.filter((item) => (props.modelValue ?? []).includes(item.key)),
)
const selectedSet = computed(() => new Set(props.modelValue))

const toggleItem = (item: OptionItem) => {
  if (item.disabled) return
  const next = new Set(props.modelValue)
  if (next.has(item.key)) next.delete(item.key)
  else next.add(item.key)
  emit("update:modelValue", Array.from(next))
}

const removeKey = (key: string) => {
  emit(
    "update:modelValue",
    (props.modelValue ?? []).filter((entry) => entry !== key),
  )
}

const onOutside = (event: MouseEvent) => {
  if (!open.value) return
  if (!root.value?.contains(event.target as Node)) open.value = false
}
onMounted(() => document.addEventListener("mousedown", onOutside))
onBeforeUnmount(() => document.removeEventListener("mousedown", onOutside))

const onKeydown = (event: KeyboardEvent) => {
  const items = enabledFiltered.value
  if (!items.length) return
  if (event.key === "ArrowDown") {
    event.preventDefault()
    highlightedIndex.value = (highlightedIndex.value + 1) % items.length
  } else if (event.key === "ArrowUp") {
    event.preventDefault()
    highlightedIndex.value = (highlightedIndex.value - 1 + items.length) % items.length
  } else if (event.key === "Enter" || event.key === " ") {
    event.preventDefault()
    if (highlightedIndex.value >= 0) toggleItem(items[highlightedIndex.value])
  } else if (event.key === "Escape") {
    open.value = false
  }
}
</script>

<template>
  <div ref="root" data-slot="multiple-select" class="relative w-full">
    <div data-slot="control" class="flex w-full items-center gap-2 rounded-lg border p-1">
      <div class="flex flex-1 flex-wrap gap-1">
        <template v-if="selectedItems.length">
          <span
            v-for="item in selectedItems"
            :key="item.key"
            class="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-1 text-sm"
          >
            {{ item.label }}
            <button
              type="button"
              class="text-muted-fg hover:text-fg"
              :disabled="disabled"
              @click="removeKey(item.key)"
            >
              <span aria-hidden="true">✕</span>
              <span class="sr-only">Remove {{ item.label }}</span>
            </button>
          </span>
        </template>
        <span v-else class="ps-2 text-muted-fg text-sm">{{ placeholder }}</span>
      </div>
      <button
        type="button"
        class="rounded-md px-2 py-1 text-muted-fg hover:text-fg"
        :disabled="disabled"
        @click="open = !open"
      >
        <span aria-hidden="true">+</span>
        <span class="sr-only">Toggle options</span>
      </button>
    </div>

    <div
      v-if="open"
      class="absolute left-0 top-full z-50 mt-2 w-full rounded-xl bg-overlay p-1 shadow-xs ring ring-muted-fg/20"
    >
      <input
        v-model="query"
        type="text"
        class="mb-1 w-full rounded-md border border-input bg-transparent px-2.5 py-1.5 text-sm outline-hidden"
        placeholder="Search..."
      />
      <div class="max-h-80 overflow-y-auto rounded-md border border-transparent" tabindex="0" @keydown="onKeydown">
        <button
          v-for="item in filtered"
          :key="item.key"
          type="button"
          :disabled="item.disabled"
          class="grid w-full grid-cols-[1fr_auto] rounded-lg px-2.5 py-1.5 text-left text-sm/6"
          :class="[
            selectedSet.has(item.key) || enabledFiltered[highlightedIndex]?.key === item.key
              ? 'bg-accent text-accent-fg'
              : 'hover:bg-accent hover:text-accent-fg',
            item.disabled ? 'opacity-50' : '',
          ]"
          @click="toggleItem(item)"
        >
          <span>
            {{ item.label }}
            <span v-if="item.description" class="block text-xs text-muted-fg">{{ item.description }}</span>
          </span>
          <span v-if="selectedSet.has(item.key)">✓</span>
        </button>
    </div>
  </div>
</template>
