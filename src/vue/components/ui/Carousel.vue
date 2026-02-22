<script setup lang="ts">
import { computed } from "vue"

type CarouselItem = {
  key: string | number
  title?: string
  description?: string
  image?: string
  alt?: string
}

const props = withDefaults(
  defineProps<{
    modelValue?: number
    items?: CarouselItem[]
  }>(),
  {
    modelValue: 0,
    items: () => [],
  },
)

const emit = defineEmits<{
  "update:modelValue": [value: number]
}>()

const currentIndex = computed(() => {
  if (!props.items.length) return 0
  return Math.max(0, Math.min(props.modelValue, props.items.length - 1))
})

const canPrev = computed(() => currentIndex.value > 0)
const canNext = computed(() => currentIndex.value < props.items.length - 1)

const goTo = (index: number) => {
  if (!props.items.length) return
  const next = Math.max(0, Math.min(index, props.items.length - 1))
  emit("update:modelValue", next)
}

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === "ArrowLeft") {
    event.preventDefault()
    goTo(currentIndex.value - 1)
  }
  if (event.key === "ArrowRight") {
    event.preventDefault()
    goTo(currentIndex.value + 1)
  }
  if (event.key === "Home") {
    event.preventDefault()
    goTo(0)
  }
  if (event.key === "End") {
    event.preventDefault()
    goTo(props.items.length - 1)
  }
}
</script>

<template>
  <section
    data-slot="carousel"
    role="region"
    aria-roledescription="carousel"
    aria-label="Image carousel"
    class="relative"
    tabindex="0"
    @keydown="onKeydown"
  >
    <div class="overflow-hidden rounded-xl border">
      <div
        data-slot="carousel-content"
        class="flex transition-transform duration-300 ease-out"
        :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
      >
        <article
          v-for="(item, index) in items"
          :key="item.key"
          data-slot="carousel-item"
          aria-roledescription="slide"
          :aria-label="`Slide ${index + 1} of ${items.length}`"
          :aria-current="index === currentIndex ? 'true' : 'false'"
          class="min-w-0 shrink-0 basis-full"
        >
          <img
            v-if="item.image"
            :src="item.image"
            :alt="item.alt || item.title || ''"
            :role="item.alt || item.title ? undefined : 'presentation'"
            class="h-56 w-full object-cover"
          />
          <div class="p-4">
            <h3 v-if="item.title" class="font-medium text-sm/6">{{ item.title }}</h3>
            <p v-if="item.description" class="text-muted-fg text-sm/6">{{ item.description }}</p>
            <slot :item="item" />
          </div>
        </article>
      </div>
    </div>

    <div data-slot="carousel-handler" class="mt-3 flex items-center justify-end gap-2">
      <button
        type="button"
        aria-label="Previous slide"
        class="rounded-md border p-2 text-sm disabled:opacity-50"
        :disabled="!canPrev"
        @click="goTo(currentIndex - 1)"
      >
        <svg viewBox="0 0 20 20" fill="currentColor" class="size-4" aria-hidden="true">
          <path
            fill-rule="evenodd"
            d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
      <button
        type="button"
        aria-label="Next slide"
        class="rounded-md border p-2 text-sm disabled:opacity-50"
        :disabled="!canNext"
        @click="goTo(currentIndex + 1)"
      >
        <svg viewBox="0 0 20 20" fill="currentColor" class="size-4" aria-hidden="true">
          <path
            fill-rule="evenodd"
            d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    </div>
  </section>
</template>
