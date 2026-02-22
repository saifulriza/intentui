<script setup lang="ts">
import { computed, ref, watch } from "vue"

const props = withDefaults(
  defineProps<{
    src?: string | null
    initials?: string
    alt?: string
    isSquare?: boolean
    size?:
      | "xs"
      | "sm"
      | "md"
      | "lg"
      | "xl"
      | "2xl"
      | "3xl"
      | "4xl"
      | "5xl"
      | "6xl"
      | "7xl"
      | "8xl"
      | "9xl"
  }>(),
  {
    src: null,
    alt: "",
    isSquare: false,
    size: "md",
  },
)

const sizeClass = {
  xs: "[--avatar-size:--spacing(5)]",
  sm: "[--avatar-size:--spacing(6)]",
  md: "[--avatar-size:--spacing(8)]",
  lg: "[--avatar-size:--spacing(10)]",
  xl: "[--avatar-size:--spacing(12)]",
  "2xl": "[--avatar-size:--spacing(14)]",
  "3xl": "[--avatar-size:--spacing(16)]",
  "4xl": "[--avatar-size:--spacing(20)]",
  "5xl": "[--avatar-size:--spacing(24)]",
  "6xl": "[--avatar-size:--spacing(28)]",
  "7xl": "[--avatar-size:--spacing(32)]",
  "8xl": "[--avatar-size:--spacing(36)]",
  "9xl": "[--avatar-size:--spacing(42)]",
} as const

const classes = computed(() =>
  [
    "inline-grid size-(--avatar-size) shrink-0 align-middle outline-1 outline-fg/(--ring-opacity) -outline-offset-1 [--avatar-radius:20%] [--ring-opacity:20%] *:col-start-1 *:row-start-1 *:size-(--avatar-size)",
    sizeClass[props.size],
    props.isSquare ? "rounded-(--avatar-radius) *:rounded-(--avatar-radius)" : "rounded-full *:rounded-full",
  ].join(" "),
)

const isImageError = ref(false)

watch(
  () => props.src,
  () => {
    isImageError.value = false
  },
)
</script>

<template>
  <span data-slot="avatar" :class="classes">
    <svg
      v-if="initials"
      class="size-full select-none fill-current p-[5%] font-md text-[48px] uppercase"
      viewBox="0 0 100 100"
      :aria-hidden="alt ? undefined : true"
    >
      <title v-if="alt">{{ alt }}</title>
      <text
        x="50%"
        y="50%"
        alignment-baseline="middle"
        dominant-baseline="middle"
        text-anchor="middle"
        dy=".125em"
      >
        {{ initials }}
      </text>
    </svg>
    <img
      v-if="src && !isImageError"
      class="size-full object-cover object-center"
      :src="src"
      :alt="alt"
      @error="isImageError = true"
    />
  </span>
</template>
