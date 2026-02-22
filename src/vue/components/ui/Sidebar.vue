<script setup lang="ts">
import { computed, onMounted, onUnmounted, provide, ref, watch } from "vue"

type SidebarItem = {
  key: string
  label: string
  href?: string
  current?: boolean
  disabled?: boolean
  badge?: string | number
}

const SIDEBAR_WIDTH = "17rem"
const SIDEBAR_WIDTH_DOCK = "3.25rem"
const SIDEBAR_COOKIE_NAME = "sidebar_state"
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7

const props = withDefaults(
  defineProps<{
    modelValue?: boolean
    items?: SidebarItem[]
    collapsible?: "hidden" | "dock" | "none"
    side?: "left" | "right"
    intent?: "default" | "float" | "inset"
    shortcut?: string
    showTrigger?: boolean
    isMobile?: boolean
  }>(),
  {
    modelValue: true,
    items: () => [],
    collapsible: "dock",
    side: "left",
    intent: "default",
    shortcut: "b",
    showTrigger: true,
    isMobile: false,
  },
)

const emit = defineEmits<{
  "update:modelValue": [value: boolean]
}>()

const openOnMobile = ref(false)
const isCollapsed = computed(() => props.collapsible !== "none" && !props.modelValue)
const state = computed(() => (props.modelValue ? "expanded" : "collapsed"))

const setOpen = (value: boolean) => emit("update:modelValue", value)
const toggleSidebar = () => {
  if (props.isMobile) {
    openOnMobile.value = !openOnMobile.value
    return
  }
  setOpen(!props.modelValue)
}

const handleShortcut = (event: KeyboardEvent) => {
  if (!props.shortcut || event.key.toLowerCase() !== props.shortcut.toLowerCase()) return
  if (!(event.metaKey || event.ctrlKey)) return

  const activeElement = document.activeElement
  const isInTextInput =
    activeElement instanceof HTMLInputElement ||
    activeElement instanceof HTMLTextAreaElement ||
    activeElement?.getAttribute("contenteditable") === "true" ||
    activeElement?.getAttribute("role") === "textbox"

  if (!isInTextInput) {
    event.preventDefault()
    toggleSidebar()
  }
}

onMounted(() => {
  window.addEventListener("keydown", handleShortcut)
})

onUnmounted(() => {
  window.removeEventListener("keydown", handleShortcut)
})

watch(
  () => props.modelValue,
  (value) => {
    document.cookie = `${SIDEBAR_COOKIE_NAME}=${value}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
  },
)

const sidebarClass = computed(() => [
  "group/sidebar relative flex h-full flex-col text-sidebar-fg transition-[width,left,right] duration-200 ease-linear",
  props.intent === "default"
    ? "bg-sidebar border-sidebar-border"
    : "bg-sidebar shadow-xs border-sidebar-border rounded-xl",
  props.side === "right" ? "border-l" : "border-r",
  props.collapsible === "none"
    ? "w-[var(--sidebar-width)]"
    : props.modelValue
      ? "w-[var(--sidebar-width)]"
      : props.collapsible === "hidden"
        ? "w-0 overflow-hidden border-transparent"
        : "w-[var(--sidebar-width-dock)]",
  props.intent === "inset" ? "mx-2 my-2 rounded-2xl border" : "",
])

const contentClass = computed(() => [
  "flex min-h-0 flex-1 flex-col overflow-auto",
  isCollapsed.value ? "items-center p-2" : "p-4",
])

const headerClass = computed(() => [
  "flex items-center justify-between gap-2",
  isCollapsed.value ? "p-2.5" : "p-3",
  props.intent === "inset" ? "px-4" : "",
])

const itemClass = (item: SidebarItem) => [
  "group/sidebar-item relative w-full min-w-0 rounded-lg text-start font-medium text-sm/5 transition-colors",
  isCollapsed.value ? "px-2 py-2 text-center" : "px-2 py-2",
  item.current
    ? "bg-sidebar-primary text-sidebar-primary-fg hover:bg-sidebar-primary/90"
    : "text-sidebar-fg hover:bg-sidebar-accent hover:text-sidebar-accent-fg",
  item.disabled ? "pointer-events-none opacity-50" : "",
]

provide("intent-sidebar", {
  state,
  open: computed(() => props.modelValue),
  isCollapsed,
  side: computed(() => props.side),
  intent: computed(() => props.intent),
  isMobile: computed(() => props.isMobile),
  openOnMobile,
  toggleSidebar,
  setOpen,
})
</script>

<template>
  <aside
    data-slot="sidebar"
    :data-state="state"
    :data-side="side"
    :data-intent="intent"
    :data-collapsible="isCollapsed ? collapsible : ''"
    :style="{ '--sidebar-width': SIDEBAR_WIDTH, '--sidebar-width-dock': SIDEBAR_WIDTH_DOCK }"
    :class="sidebarClass"
  >
    <div data-slot="sidebar-header" :class="headerClass">
      <slot name="header">
        <span v-if="!isCollapsed" class="font-medium text-sm">Sidebar</span>
        <span v-else aria-hidden="true" class="text-xs">SB</span>
      </slot>
      <button
        v-if="showTrigger && collapsible !== 'none'"
        type="button"
        data-slot="sidebar-trigger"
        aria-label="Toggle Sidebar"
        class="shrink-0 rounded-md p-1.5 hover:bg-secondary"
        @click="toggleSidebar"
      >
        {{ modelValue ? "⟨" : "⟩" }}
      </button>
    </div>

    <nav data-slot="sidebar-content" :class="contentClass">
      <a
        v-for="item in items"
        :key="item.key"
        data-slot="sidebar-item"
        :href="item.href || '#'"
        :aria-current="item.current ? 'page' : undefined"
        :aria-disabled="item.disabled ? true : undefined"
        :class="itemClass(item)"
      >
        <span v-if="!isCollapsed || collapsible === 'none'">{{ item.label }}</span>
        <span v-else aria-hidden="true">{{ item.label.charAt(0) }}</span>

        <span
          v-if="item.badge !== undefined && !isCollapsed"
          data-slot="sidebar-badge"
          class="absolute end-1.5 top-1/2 -translate-y-1/2 rounded-full bg-fg/5 px-2 text-[10px]/5.5"
        >
          {{ item.badge }}
        </span>
        <span
          v-else-if="item.badge !== undefined && isCollapsed"
          aria-hidden="true"
          class="absolute end-1 top-1 size-1.5 rounded-full bg-primary"
        />
      </a>
      <slot />
    </nav>

    <div data-slot="sidebar-footer" class="mt-auto p-2">
      <slot name="footer" />
    </div>
  </aside>
</template>
