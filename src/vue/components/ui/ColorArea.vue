<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from "vue"
import ColorThumb from "./ColorThumb.vue"

type Point = { x: number; y: number }

const props = withDefaults(
  defineProps<{
    modelValue?: Point
    disabled?: boolean
    hue?: number
  }>(),
  {
    modelValue: () => ({ x: 50, y: 50 }),
    disabled: false,
    hue: 220,
  },
)

const emit = defineEmits<{
  "update:modelValue": [value: Point]
}>()

const root = ref<HTMLElement | null>(null)
const dragging = ref(false)
const thumbColor = computed(() => {
  const saturation = props.modelValue.x
  const lightness = 100 - props.modelValue.y
  return `hsl(${props.hue} ${saturation}% ${lightness}%)`
})

const clamp = (value: number) => Math.min(100, Math.max(0, value))

const toPoint = (event: MouseEvent) => {
  const rect = root.value?.getBoundingClientRect()
  if (!rect) return null
  return {
    x: clamp(((event.clientX - rect.left) / rect.width) * 100),
    y: clamp(((event.clientY - rect.top) / rect.height) * 100),
  }
}

const setFromEvent = (event: MouseEvent) => {
  if (props.disabled) return
  const point = toPoint(event)
  if (!point) return
  emit("update:modelValue", point)
}

const onMove = (event: MouseEvent) => {
  if (!dragging.value) return
  setFromEvent(event)
}

const onUp = () => {
  dragging.value = false
  document.removeEventListener("mousemove", onMove)
  document.removeEventListener("mouseup", onUp)
}

const onDown = (event: MouseEvent) => {
  if (props.disabled) return
  dragging.value = true
  setFromEvent(event)
  document.addEventListener("mousemove", onMove)
  document.addEventListener("mouseup", onUp)
}

const onKeydown = (event: KeyboardEvent) => {
  if (props.disabled) return
  const amount = event.shiftKey ? 5 : 1
  if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) return
  event.preventDefault()
  const next = { ...props.modelValue }
  if (event.key === "ArrowLeft") next.x = clamp(next.x - amount)
  if (event.key === "ArrowRight") next.x = clamp(next.x + amount)
  if (event.key === "ArrowUp") next.y = clamp(next.y - amount)
  if (event.key === "ArrowDown") next.y = clamp(next.y + amount)
  emit("update:modelValue", next)
}

watch(
  () => props.disabled,
  (disabled) => {
    if (disabled && dragging.value) onUp()
  },
)

onBeforeUnmount(() => {
  document.removeEventListener("mousemove", onMove)
  document.removeEventListener("mouseup", onUp)
})
</script>

<template>
  <div
    ref="root"
    data-slot="color-area"
    class="relative size-56 shrink-0 rounded-md"
    :class="{ 'opacity-50': disabled }"
    role="application"
    aria-label="Color area"
    :tabindex="disabled ? -1 : 0"
    :style="{
      background: `linear-gradient(to top, black, transparent), linear-gradient(to right, white, hsl(${hue} 100% 50%))`,
    }"
    @mousedown="onDown"
    @keydown="onKeydown"
  >
    <ColorThumb :x="modelValue.x" :y="modelValue.y" :color="thumbColor" :disabled="disabled" />
    <slot />
  </div>
</template>
