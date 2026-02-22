<template>
  <div
    class="flex items-center gap-2 rounded-md border bg-muted px-4 font-medium text-sm shadow-xs *:data-[slot=icon]:pointer-events-none [&_[data-slot=icon]:not([class*='size-'])]:size-5 sm:[&_[data-slot=icon]:not([class*='size-'])]:size-4"
  >
    <slot />
  </div>
</template>
