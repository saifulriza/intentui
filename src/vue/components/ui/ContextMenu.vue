<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue"

type ContextMenuItem = {
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
    items?: ContextMenuItem[]
  }>(),
  {
    modelValue: false,
    items: () => [],
  },
)

const emit = defineEmits<{
  "update:modelValue": [value: boolean]
  select: [item: ContextMenuItem]
}>()

const root = ref<HTMLElement | null>(null)
const position = ref({ x: 0, y: 0 })
const menuSize = { width: 240, height: 280 }

const close = () => emit("update:modelValue", false)
const onSelect = (item: ContextMenuItem) => {
  if (item.disabled) return
  emit("select", item)
  close()
}

const onOutside = (event: MouseEvent) => {
  if (!props.modelValue) return
  if (!root.value?.contains(event.target as Node)) close()
}

onMounted(() => document.addEventListener("mousedown", onOutside))
onBeforeUnmount(() => document.removeEventListener("mousedown", onOutside))

const onContextMenu = (event: MouseEvent) => {
  event.preventDefault()
  const maxX = Math.max(window.innerWidth - menuSize.width, 0)
  const maxY = Math.max(window.innerHeight - menuSize.height, 0)
  position.value = { x: Math.min(event.clientX, maxX), y: Math.min(event.clientY, maxY) }
  emit("update:modelValue", true)
}
</script>

<template>
  <div ref="root" data-slot="context-menu" class="relative" @contextmenu="onContextMenu">
    <slot />
    <div
      v-if="modelValue"
      data-slot="context-menu-content"
      role="menu"
      class="fixed z-50 min-w-40 rounded-xl bg-overlay text-overlay-fg p-1 shadow-xs ring ring-muted-fg/20"
      :style="{ left: `${position.x}px`, top: `${position.y}px` }"
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
          item.disabled ? 'opacity-50' : '',
        ]"
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
