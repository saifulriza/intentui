<script setup lang="ts">
import { computed } from "vue"

type SidebarItem = {
  key: string
  label: string
  href?: string
  current?: boolean
  disabled?: boolean
}

const props = withDefaults(
  defineProps<{
    modelValue?: boolean
    items?: SidebarItem[]
    collapsible?: "hidden" | "dock" | "none"
    side?: "left" | "right"
  }>(),
  {
    modelValue: true,
    items: () => [],
    collapsible: "dock",
    side: "left",
  },
)

const emit = defineEmits<{
  "update:modelValue": [value: boolean]
}>()

const open = computed(() => props.modelValue)
const toggle = () => emit("update:modelValue", !props.modelValue)
</script>

<template>
  <aside
    data-slot="sidebar"
    :data-side="side"
    :data-collapsible="collapsible"
    class="group relative border-r bg-sidebar text-sidebar-fg transition-[width] duration-200"
    :class="[
      side === 'right' ? 'border-l border-r-0' : '',
      collapsible === 'none' ? 'w-[17rem]' : open ? 'w-[17rem]' : 'w-[3.25rem]',
    ]"
  >
    <div data-slot="sidebar-header" class="flex items-center justify-between p-3">
      <slot name="header">
        <span class="font-medium text-sm">Sidebar</span>
      </slot>
      <button
        v-if="collapsible !== 'none'"
        type="button"
        data-slot="sidebar-trigger"
        aria-label="Toggle Sidebar"
        class="rounded-md p-1.5 hover:bg-secondary"
        @click="toggle"
      >
        {{ open ? "⟨" : "⟩" }}
      </button>
    </div>

    <nav data-slot="sidebar-content" class="flex min-h-0 flex-1 flex-col gap-y-1 p-2">
      <a
        v-for="item in items"
        :key="item.key"
        data-slot="sidebar-item"
        :href="item.href || '#'"
        :aria-current="item.current ? 'page' : undefined"
        :aria-disabled="item.disabled ? true : undefined"
        class="rounded-lg px-2 py-2 text-sm/5 font-medium transition-colors"
        :class="[
          item.current ? 'bg-sidebar-primary text-sidebar-primary-fg' : 'hover:bg-sidebar-accent',
          item.disabled ? 'pointer-events-none opacity-50' : '',
          !open && collapsible !== 'none' ? 'text-center' : '',
        ]"
      >
        <span v-if="open || collapsible === 'none'">{{ item.label }}</span>
        <span v-else aria-hidden="true">{{ item.label.charAt(0) }}</span>
      </a>
      <slot />
    </nav>
  </aside>
</template>
