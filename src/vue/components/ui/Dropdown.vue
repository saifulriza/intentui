<script setup lang="ts">
import { computed, ref, watch } from "vue"

type DropdownItem = {
  key: string
  label: string
  description?: string
  shortcut?: string
  intent?: "danger" | "warning" | "default"
  disabled?: boolean
}

type DropdownSection = {
  title?: string
  items: DropdownItem[]
}

const props = withDefaults(
  defineProps<{
    modelValue?: string | string[]
    items?: DropdownItem[]
    sections?: DropdownSection[]
    selectionMode?: "single" | "multiple"
  }>(),
  {
    modelValue: "",
    items: () => [],
    sections: () => [],
    selectionMode: "single",
  },
)

const emit = defineEmits<{
  "update:modelValue": [value: string | string[]]
  select: [item: DropdownItem]
}>()

const hasSections = computed(() => props.sections.length > 0)
const normalizedSections = computed<DropdownSection[]>(() =>
  hasSections.value ? props.sections : [{ items: props.items }],
)

const selectedKeys = computed(() =>
  Array.isArray(props.modelValue) ? new Set(props.modelValue) : new Set([props.modelValue]),
)

const enabledKeys = computed(() =>
  normalizedSections.value.flatMap((section) =>
    section.items.filter((item) => !item.disabled).map((item) => item.key),
  ),
)
const enabledKeyIndexMap = computed(
  () => new Map(enabledKeys.value.map((key, index) => [key, index])),
)

const highlightedIndex = ref(0)
const currentHighlightedKey = computed(() => enabledKeys.value[highlightedIndex.value])

watch(
  enabledKeys,
  (keys) => {
    if (!keys.length) {
      highlightedIndex.value = 0
      return
    }
    if (highlightedIndex.value >= keys.length) highlightedIndex.value = 0
  },
  { immediate: true },
)

const updateValue = (key: string) => {
  if (props.selectionMode === "single") {
    emit("update:modelValue", key)
    return
  }
  const next = new Set(selectedKeys.value)
  if (next.has(key)) next.delete(key)
  else next.add(key)
  emit("update:modelValue", Array.from(next))
}

const selectItem = (item: DropdownItem) => {
  if (item.disabled) return
  updateValue(item.key)
  emit("select", item)
}

const onKeydown = (event: KeyboardEvent) => {
  const keys = enabledKeys.value
  if (!keys.length) return
  if (event.key === "ArrowDown") {
    event.preventDefault()
    highlightedIndex.value = (highlightedIndex.value + 1) % keys.length
  } else if (event.key === "ArrowUp") {
    event.preventDefault()
    highlightedIndex.value = (highlightedIndex.value - 1 + keys.length) % keys.length
  } else if (event.key === "Enter" || event.key === " ") {
    event.preventDefault()
    const active = keys[highlightedIndex.value]
    for (const section of normalizedSections.value) {
      const item = section.items.find((entry) => entry.key === active && !entry.disabled)
      if (item) {
        selectItem(item)
        break
      }
    }
  }
}

const shouldShowDivider = (sectionIndex: number) =>
  sectionIndex < normalizedSections.value.length - 1 &&
  normalizedSections.value[sectionIndex].items.length > 0 &&
  normalizedSections.value[sectionIndex + 1].items.length > 0

const onHoverItem = (item: DropdownItem) => {
  const nextIndex = enabledKeyIndexMap.value.get(item.key)
  if (nextIndex !== undefined) highlightedIndex.value = nextIndex
}
</script>

<template>
  <div
    data-slot="dropdown"
    class="grid grid-cols-[auto_1fr] gap-y-1 rounded-xl p-1 outline-hidden"
    role="listbox"
    tabindex="0"
    @keydown="onKeydown"
  >
    <template v-for="(section, sectionIndex) in normalizedSections" :key="`section-${sectionIndex}`">
      <div
        v-if="section.title"
        class="col-span-full px-3 py-2 font-medium text-muted-fg text-sm/6 sm:px-2.5 sm:py-1.5 sm:text-xs/3"
      >
        {{ section.title }}
      </div>

      <button
        v-for="item in section.items"
        :key="item.key"
        type="button"
        role="option"
        tabindex="-1"
        :aria-selected="selectedKeys.has(item.key)"
        :disabled="item.disabled"
        class="col-span-full grid cursor-default grid-cols-[1fr_auto] items-center rounded-lg px-3 py-2 text-left text-base/6 sm:px-2.5 sm:py-1.5 sm:text-sm/6"
        :class="[
          item.intent === 'danger'
            ? 'text-danger-subtle-fg hover:bg-danger-subtle'
            : item.intent === 'warning'
              ? 'text-warning-subtle-fg hover:bg-warning-subtle'
              : 'text-fg hover:bg-accent hover:text-accent-fg',
          currentHighlightedKey === item.key ? 'bg-accent text-accent-fg' : '',
          item.disabled ? 'opacity-50' : '',
        ]"
        @mouseenter="onHoverItem(item)"
        @click="selectItem(item)"
      >
        <span class="min-w-0">
          <span class="block truncate">{{ item.label }}</span>
          <span v-if="item.description" class="block truncate text-muted-fg text-sm">
            {{ item.description }}
          </span>
        </span>
        <span class="flex items-center gap-2 ps-2">
          <span
            v-if="item.shortcut"
            data-slot="keyboard"
            class="text-muted-fg text-xs"
            aria-hidden="true"
          >
            {{ item.shortcut }}
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
        </span>
      </button>

      <div
        v-if="shouldShowDivider(sectionIndex)"
        role="separator"
        aria-orientation="horizontal"
        class="col-span-full -mx-1 h-px bg-fg/10"
      />
    </template>
  </div>
</template>
