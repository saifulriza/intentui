<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from "vue"
import ColorThumb from "./ColorThumb.vue"

const INNER_RING_PERCENT = 44
const OUTER_RING_PERCENT = 58

const props = withDefaults(
  defineProps<{
    modelValue?: number
    disabled?: boolean
  }>(),
  {
    modelValue: 0,
    disabled: false,
  },
)

const emit = defineEmits<{
  "update:modelValue": [value: number]
}>()

const root = ref<HTMLElement | null>(null)
const dragging = ref(false)

const normalizedHue = computed(() => ((props.modelValue % 360) + 360) % 360)
const angleInRadian = computed(() => (normalizedHue.value * Math.PI) / 180)
// 50 is the center point in percentage coordinates for this square wheel.
const thumbX = computed(() => 50 + Math.cos(angleInRadian.value) * INNER_RING_PERCENT)
const thumbY = computed(() => 50 + Math.sin(angleInRadian.value) * INNER_RING_PERCENT)

const angleFromEvent = (event: MouseEvent) => {
  const rect = root.value?.getBoundingClientRect()
  if (!rect) return null
  const cx = rect.left + rect.width / 2
  const cy = rect.top + rect.height / 2
  const angle = Math.atan2(event.clientY - cy, event.clientX - cx)
  return Math.round(((angle * 180) / Math.PI + 360) % 360)
}

const setHue = (event: MouseEvent) => {
  if (props.disabled) return
  const angle = angleFromEvent(event)
  if (angle === null) return
  emit("update:modelValue", angle)
}

const onMove = (event: MouseEvent) => {
  if (!dragging.value) return
  setHue(event)
}

const onUp = () => {
  dragging.value = false
  document.removeEventListener("mousemove", onMove)
  document.removeEventListener("mouseup", onUp)
}

const onDown = (event: MouseEvent) => {
  if (props.disabled) return
  dragging.value = true
  setHue(event)
  document.addEventListener("mousemove", onMove)
  document.addEventListener("mouseup", onUp)
}

onBeforeUnmount(() => {
  document.removeEventListener("mousemove", onMove)
  document.removeEventListener("mouseup", onUp)
})
</script>

<template>
  <div
    ref="root"
    data-slot="color-wheel"
    class="relative size-56 rounded-full"
    :class="{ 'opacity-50': disabled }"
    :style="{
      background:
        `conic-gradient(red, yellow, lime, cyan, blue, magenta, red), radial-gradient(circle, transparent ${INNER_RING_PERCENT}%, white ${INNER_RING_PERCENT}%, white ${OUTER_RING_PERCENT}%, transparent ${OUTER_RING_PERCENT}%)`,
    }"
    @mousedown="onDown"
  >
    <ColorThumb :x="thumbX" :y="thumbY" :color="`hsl(${normalizedHue} 100% 50%)`" :disabled="disabled" />
    <slot />
  </div>
</template>
