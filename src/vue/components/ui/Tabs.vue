<script setup lang="ts">
import { computed } from "vue"

type TabItem = {
  key: string
  label: string
  disabled?: boolean
}

const props = withDefaults(
  defineProps<{
    modelValue?: string
    items?: TabItem[]
    orientation?: "horizontal" | "vertical"
  }>(),
  {
    modelValue: "",
    items: () => [],
    orientation: "horizontal",
  },
)

const emit = defineEmits<{
  "update:modelValue": [value: string]
}>()

const activeKey = computed(() => props.modelValue || props.items[0]?.key || "")
const setActive = (key: string, disabled?: boolean) => {
  if (!disabled) emit("update:modelValue", key)
}

const onTabKeydown = (event: KeyboardEvent) => {
  const enabled = props.items.filter((item) => !item.disabled)
  if (!enabled.length) return
  const currentEnabledIndex = enabled.findIndex((item) => item.key === activeKey.value)
  if (currentEnabledIndex < 0) return
  const next = (step: number) => {
    const target = enabled[(currentEnabledIndex + step + enabled.length) % enabled.length]
    setActive(target.key)
  }
  if (props.orientation === "horizontal" && event.key === "ArrowRight") {
    event.preventDefault()
    next(1)
  } else if (props.orientation === "horizontal" && event.key === "ArrowLeft") {
    event.preventDefault()
    next(-1)
  } else if (props.orientation === "vertical" && event.key === "ArrowDown") {
    event.preventDefault()
    next(1)
  } else if (props.orientation === "vertical" && event.key === "ArrowUp") {
    event.preventDefault()
    next(-1)
  }
}
</script>

<template>
  <div
    data-slot="tabs"
    class="group/tabs flex gap-4 self-start forced-color-adjust-none"
    :class="orientation === 'vertical' ? 'w-full flex-col' : 'flex-row'"
  >
    <div
      data-slot="tab-list"
      class="relative flex forced-color-adjust-none"
      :class="
        orientation === 'horizontal'
          ? 'flex-row gap-x-1 rounded-lg border-b py-1'
          : 'min-w-56 shrink-0 flex-col items-start gap-y-2 border-r px-2'
      "
      role="tablist"
      :aria-orientation="orientation"
    >
      <button
        v-for="item in items"
        :key="item.key"
        type="button"
        role="tab"
        :aria-selected="activeKey === item.key"
        :tabindex="activeKey === item.key ? 0 : -1"
        :disabled="item.disabled"
        :class="[
          'relative flex items-center whitespace-nowrap rounded-lg px-3 py-1.5 font-medium text-sm/6 outline-hidden transition',
          activeKey === item.key
            ? 'bg-primary-subtle text-primary-subtle-fg'
            : 'text-muted-fg hover:bg-secondary hover:text-fg',
          item.disabled ? 'opacity-50' : '',
        ]"
        @click="setActive(item.key, item.disabled)"
        @keydown="onTabKeydown"
      >
        <slot name="tab" :item="item" :selected="activeKey === item.key">
          {{ item.label }}
        </slot>
      </button>
    </div>

    <div data-slot="tab-panel" role="tabpanel" class="flex-1 text-fg text-sm/6 focus-visible:outline-hidden">
      <slot name="panel" :active-key="activeKey">
        <slot />
      </slot>
    </div>
  </div>
</template>
