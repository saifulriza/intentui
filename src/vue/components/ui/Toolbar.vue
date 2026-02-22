<script setup lang="ts">
import { computed, provide, ref, toRef } from "vue"

const props = withDefaults(
  defineProps<{
    orientation?: "horizontal" | "vertical"
    isCircle?: boolean
  }>(),
  {
    orientation: "horizontal",
    isCircle: false,
  },
)

const classes = computed(() => [
  "group inset-ring inset-ring-border inline-flex gap-1.5 bg-overlay p-1.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
  props.isCircle ? "rounded-full" : "rounded-lg",
  props.orientation === "horizontal" ? "flex-row items-center" : "flex-col items-start",
])

const toolbarRef = ref<HTMLElement | null>(null)
const onKeydown = (event: KeyboardEvent) => {
  if (props.orientation !== "horizontal") return
  if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return
  const controls = toolbarRef.value?.querySelectorAll<HTMLElement>("[data-slot='toolbar-item']")
  if (!controls || controls.length === 0) return
  const activeIndex = Array.from(controls).findIndex((item) => item === document.activeElement)
  const nextIndex = event.key === "ArrowRight" ? activeIndex + 1 : activeIndex - 1
  const target = controls[(nextIndex + controls.length) % controls.length]
  target?.focus()
}

provide("intent-toolbar", {
  orientation: toRef(props, "orientation"),
  isCircle: toRef(props, "isCircle"),
})
</script>

<template>
  <div
    ref="toolbarRef"
    data-slot="toolbar"
    role="toolbar"
    :aria-orientation="orientation"
    :class="classes"
    @keydown="onKeydown"
  >
    <slot />
  </div>
</template>
