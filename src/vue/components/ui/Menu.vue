<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue"

type MenuItem = {
  key: string
  label: string
  description?: string
  shortcut?: string
  intent?: "danger" | "warning" | "default"
  disabled?: boolean
}

const props = withDefaults(
  defineProps<{
    modelValue?: boolean
    items?: MenuItem[]
    closeOnSelect?: boolean
  }>(),
  {
    modelValue: false,
    items: () => [],
    closeOnSelect: true,
  },
)

const emit = defineEmits<{
  "update:modelValue": [value: boolean]
  select: [item: MenuItem]
}>()

const root = ref<HTMLElement | null>(null)
const highlightedIndex = ref(-1)
const menuContent = ref<HTMLElement | null>(null)

const toggle = () => emit("update:modelValue", !props.modelValue)
const close = () => emit("update:modelValue", false)

const onOutside = (event: MouseEvent) => {
  if (!props.modelValue) return
  if (!root.value?.contains(event.target as Node)) close()
}

onMounted(() => document.addEventListener("mousedown", onOutside))
onBeforeUnmount(() => document.removeEventListener("mousedown", onOutside))

const onSelect = (item: MenuItem) => {
  if (item.disabled) return
  emit("select", item)
  if (props.closeOnSelect) close()
}

const enabledItems = computed(() => props.items.filter((item) => !item.disabled))

const onKeydown = (event: KeyboardEvent) => {
  const items = enabledItems.value
  if (!items.length) return
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
    event.preventDefault()
    if (highlightedIndex.value >= 0) {
      onSelect(items[highlightedIndex.value])
    }
  }
}

watch(
  () => props.modelValue,
  async (open) => {
    if (open) {
      await nextTick()
      menuContent.value?.focus()
      highlightedIndex.value = 0
    } else {
      highlightedIndex.value = -1
    }
  },
)
</script>

<template>
  <div ref="root" data-slot="menu" class="relative inline-flex">
    <slot name="trigger" :open="modelValue" :toggle="toggle">
      <button
        type="button"
        data-slot="menu-trigger"
        class="relative inline text-start outline-hidden focus-visible:ring-1 focus-visible:ring-primary"
        @click="toggle"
      >
        Open menu
      </button>
    </slot>

    <div
      v-if="modelValue"
      ref="menuContent"
      data-slot="menu-content"
      class="absolute left-0 top-full z-50 mt-2 min-w-40 rounded-xl bg-overlay text-overlay-fg shadow-xs ring ring-muted-fg/20 p-1"
      role="menu"
      tabindex="0"
      @keydown="onKeydown"
    >
      <button
        v-for="item in items"
        :key="item.key"
        type="button"
        role="menuitem"
        :disabled="item.disabled"
        class="group relative grid w-full grid-cols-[1fr_auto] items-center rounded-lg px-2.5 py-1.5 text-start text-sm/6 outline-hidden"
        :class="[
          item.intent === 'danger'
            ? 'text-danger-subtle-fg hover:bg-danger-subtle'
            : item.intent === 'warning'
              ? 'text-warning-subtle-fg hover:bg-warning-subtle'
              : 'text-fg hover:bg-accent hover:text-accent-fg',
          enabledItems[highlightedIndex]?.key === item.key ? 'bg-accent text-accent-fg' : '',
          item.disabled ? 'opacity-50' : '',
        ]"
        @mouseenter="highlightedIndex = enabledItems.findIndex((x) => x.key === item.key)"
        @click="onSelect(item)"
      >
        <span>
          <span class="block">{{ item.label }}</span>
          <span v-if="item.description" class="block text-muted-fg text-xs">{{ item.description }}</span>
        </span>
        <span v-if="item.shortcut" data-slot="keyboard" class="ps-2 text-xs text-muted-fg">
          {{ item.shortcut }}
        </span>
      </button>
    </div>
  </div>
</template>
