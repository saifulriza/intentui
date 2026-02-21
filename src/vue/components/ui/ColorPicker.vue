<script setup lang="ts">
import { computed, ref, watch } from "vue"
import { EyeDropperIcon } from "@heroicons/vue/24/solid"
import Button from "./Button.vue"
import ColorArea from "./ColorArea.vue"
import ColorField from "./ColorField.vue"
import ColorSlider from "./ColorSlider.vue"
import ColorSwatch from "./ColorSwatch.vue"
import ColorWheel from "./ColorWheel.vue"

declare global {
  interface Window {
    EyeDropper?: new () => { open: () => Promise<{ sRGBHex: string }> }
  }
}

const props = withDefaults(
  defineProps<{
    modelValue?: string
    disabled?: boolean
  }>(),
  {
    modelValue: "#3b82f6",
    disabled: false,
  },
)

const emit = defineEmits<{
  "update:modelValue": [value: string]
}>()

const hsv = ref({ h: 220, s: 75, v: 96 })

const HUE_DEGREES_PER_SECTOR = 60
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

const hexToRgb = (hex: string) => {
  const valid = hex.trim().match(/^#([0-9a-fA-F]{6})$/)
  if (!valid) return null
  const value = valid[1]
  return {
    r: Number.parseInt(value.slice(0, 2), 16),
    g: Number.parseInt(value.slice(2, 4), 16),
    b: Number.parseInt(value.slice(4, 6), 16),
  }
}

const rgbToHex = (r: number, g: number, b: number) =>
  `#${[r, g, b]
    .map((v) => Math.round(clamp(v, 0, 255)).toString(16).padStart(2, "0"))
    .join("")}`

const rgbToHsv = (r: number, g: number, b: number) => {
  const rn = r / 255
  const gn = g / 255
  const bn = b / 255
  const max = Math.max(rn, gn, bn)
  const min = Math.min(rn, gn, bn)
  const delta = max - min
  let h = 0
  if (delta !== 0) {
    if (max === rn) h = ((gn - bn) / delta) % 6
    else if (max === gn) h = (bn - rn) / delta + 2
    else h = (rn - gn) / delta + 4
    h *= 60
    if (h < 0) h += 360
  }
  return {
    h,
    s: max === 0 ? 0 : (delta / max) * 100,
    v: max * 100,
  }
}

const hsvToRgb = (h: number, s: number, v: number) => {
  const sn = clamp(s, 0, 100) / 100
  const vn = clamp(v, 0, 100) / 100
  const c = vn * sn
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = vn - c
  let r = 0
  let g = 0
  let b = 0
  // Standard HSV -> RGB conversion by splitting hue into 60° sectors.
  if (h < HUE_DEGREES_PER_SECTOR) [r, g, b] = [c, x, 0]
  else if (h < HUE_DEGREES_PER_SECTOR * 2) [r, g, b] = [x, c, 0]
  else if (h < HUE_DEGREES_PER_SECTOR * 3) [r, g, b] = [0, c, x]
  else if (h < HUE_DEGREES_PER_SECTOR * 4) [r, g, b] = [0, x, c]
  else if (h < HUE_DEGREES_PER_SECTOR * 5) [r, g, b] = [x, 0, c]
  else [r, g, b] = [c, 0, x]
  return {
    r: (r + m) * 255,
    g: (g + m) * 255,
    b: (b + m) * 255,
  }
}

const syncFromHex = (value: string) => {
  const rgb = hexToRgb(value)
  if (!rgb) return
  hsv.value = rgbToHsv(rgb.r, rgb.g, rgb.b)
}

watch(
  () => props.modelValue,
  (value) => syncFromHex(value),
  { immediate: true },
)

const currentColor = computed(() => {
  const rgb = hsvToRgb(hsv.value.h, hsv.value.s, hsv.value.v)
  return rgbToHex(rgb.r, rgb.g, rgb.b)
})
const hasEyeDropper = computed(() => typeof window !== "undefined" && !!window.EyeDropper)

const onField = (value: string) => {
  const rgb = hexToRgb(value)
  if (!rgb) return
  hsv.value = rgbToHsv(rgb.r, rgb.g, rgb.b)
  emit("update:modelValue", value)
}

const onHue = (h: number) => {
  hsv.value = { ...hsv.value, h }
  emit("update:modelValue", currentColor.value)
}

const onPoint = (point: { x: number; y: number }) => {
  hsv.value = { ...hsv.value, s: point.x, v: 100 - point.y }
  emit("update:modelValue", currentColor.value)
}

const eyeDrop = async () => {
  if (props.disabled || !window.EyeDropper) return
  try {
    const eyeDropper = new window.EyeDropper()
    const result = await eyeDropper.open()
    onField(result.sRGBHex)
  } catch {
    // user cancelled eyedropper or browser blocked the request
  }
}
</script>

<template>
  <div data-slot="color-picker" class="w-fit rounded-xl border border-input p-3">
    <div class="mb-3 flex items-center gap-2">
      <ColorSwatch :color="currentColor" rounded="lg" />
      <ColorField :model-value="currentColor" :disabled="disabled" @update:model-value="onField" />
      <Button v-if="hasEyeDropper" intent="outline" size="sq-md" @click="eyeDrop">
        <EyeDropperIcon />
      </Button>
    </div>
    <div class="flex flex-wrap gap-3">
      <ColorWheel :model-value="hsv.h" :disabled="disabled" @update:model-value="onHue" />
      <ColorArea
        :model-value="{ x: hsv.s, y: 100 - hsv.v }"
        :hue="hsv.h"
        :disabled="disabled"
        @update:model-value="onPoint"
      />
    </div>
    <div class="mt-3">
      <ColorSlider :model-value="hsv.h" :disabled="disabled" label="Hue" @update:model-value="onHue" />
    </div>
    <slot />
  </div>
</template>
