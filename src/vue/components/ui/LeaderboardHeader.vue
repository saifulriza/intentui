<template>
  <div
    data-slot="leaderboard-header"
    class="grid auto-rows-min grid-rows-[auto_auto] items-start gap-1 px-(--gutter) has-data-[slot=leaderboard-action]:grid-cols-[1fr_auto]"
  >
    <slot />
  </div>
</template>
