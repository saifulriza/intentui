<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue"

type ScrollAreaOrientation = "vertical" | "horizontal" | "both"

const props = withDefaults(
  defineProps<{
    orientation?: ScrollAreaOrientation
    scrollFade?: boolean
    scrollbarGutter?: boolean
  }>(),
  {
    orientation: "both",
    scrollFade: false,
    scrollbarGutter: false,
  },
)

const viewportRef = ref<HTMLDivElement | null>(null)

const allowY = computed(() => props.orientation === "vertical" || props.orientation === "both")
const allowX = computed(() => props.orientation === "horizontal" || props.orientation === "both")

const updateOverflowState = () => {
  const el = viewportRef.value
  if (!el) return

  const hasY = allowY.value && el.scrollHeight > el.clientHeight + 1
  const hasX = allowX.value && el.scrollWidth > el.clientWidth + 1

  el.toggleAttribute("data-has-overflow-y", hasY)
  el.toggleAttribute("data-has-overflow-x", hasX)

  const yStart = hasY ? Math.max(0, el.scrollTop) : 0
  const yEnd = hasY ? Math.max(0, el.scrollHeight - el.clientHeight - el.scrollTop) : 0
  const xStart = hasX ? Math.max(0, el.scrollLeft) : 0
  const xEnd = hasX ? Math.max(0, el.scrollWidth - el.clientWidth - el.scrollLeft) : 0

  el.style.setProperty("--scroll-area-overflow-y-start", `${yStart}px`)
  el.style.setProperty("--scroll-area-overflow-y-end", `${yEnd}px`)
  el.style.setProperty("--scroll-area-overflow-x-start", `${xStart}px`)
  el.style.setProperty("--scroll-area-overflow-x-end", `${xEnd}px`)
}

let resizeObserver: ResizeObserver | undefined
const onScroll = () => updateOverflowState()

onMounted(() => {
  const el = viewportRef.value
  if (!el) return

  resizeObserver = new ResizeObserver(updateOverflowState)
  resizeObserver.observe(el)
  el.addEventListener("scroll", onScroll, { passive: true })
  updateOverflowState()
})

onUnmounted(() => {
  const el = viewportRef.value
  if (el) el.removeEventListener("scroll", onScroll)
  resizeObserver?.disconnect()
})
</script>

<template>
  <div data-slot="scroll-area" class="size-full min-h-0">
    <div
      ref="viewportRef"
      data-slot="scroll-area-viewport"
      class="h-full overscroll-auto rounded-[inherit] outline-none transition-shadow data-has-overflow-y:overscroll-y-contain data-has-overflow-x:overscroll-x-contain"
      :class="[
        orientation === 'vertical'
          ? 'overflow-y-auto overflow-x-hidden'
          : orientation === 'horizontal'
            ? 'overflow-x-auto overflow-y-hidden'
            : 'overflow-auto',
        scrollFade
          ? [
              allowY
                ? 'mask-t-from-[calc(100%-min(var(--fade-size,--spacing(6)),var(--scroll-area-overflow-y-start,0px)))] mask-b-from-[calc(100%-min(var(--fade-size,--spacing(6)),var(--scroll-area-overflow-y-end,0px)))]'
                : '',
              allowX
                ? 'mask-l-from-[calc(100%-min(var(--fade-size,--spacing(6)),var(--scroll-area-overflow-x-start,0px)))] mask-r-from-[calc(100%-min(var(--fade-size,--spacing(6)),var(--scroll-area-overflow-x-end,0px)))]'
                : '',
            ]
          : '',
        scrollbarGutter ? [allowY ? 'data-has-overflow-y:pe-2.5' : '', allowX ? 'data-has-overflow-x:pb-2.5' : ''] : '',
      ]"
    >
      <slot />
    </div>
  </div>
</template>
