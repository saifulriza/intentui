<script setup lang="ts">
type TableColumn = {
  key: string
  label: string
  align?: "left" | "center" | "right"
}

const props = withDefaults(
  defineProps<{
    columns?: TableColumn[]
    rows?: Record<string, unknown>[]
    striped?: boolean
    grid?: boolean
    emptyText?: string
  }>(),
  {
    columns: () => [],
    rows: () => [],
    striped: false,
    grid: false,
    emptyText: "No records found.",
  },
)

const getAlignClass = (align?: TableColumn["align"]) => {
  if (align === "center") return "text-center"
  if (align === "right") return "text-right"
  return "text-left"
}
</script>

<template>
  <div class="flow-root">
    <div data-slot="table-wrapper" class="-mx-4 overflow-x-auto whitespace-nowrap">
      <div class="inline-block min-w-full align-middle">
        <table
          data-slot="table"
          class="min-w-full caption-bottom text-sm/6 outline-hidden"
          :class="grid ? 'border-collapse border-spacing-0' : ''"
        >
          <thead data-slot="table-header" class="border-b">
            <tr data-slot="table-row">
              <th
                v-for="column in columns"
                :key="column.key"
                data-slot="table-column"
                class="px-4 py-2 text-start font-medium text-muted-fg"
                :class="[
                  getAlignClass(column.align),
                  grid ? 'border-l first:border-l-0' : '',
                ]"
              >
                {{ column.label }}
              </th>
            </tr>
          </thead>
          <tbody data-slot="table-body">
            <tr v-if="rows.length === 0">
              <td :colspan="columns.length || 1" class="px-4 py-8 text-center text-muted-fg">
                {{ emptyText }}
              </td>
            </tr>
            <template v-else>
              <tr
                v-for="(row, rowIndex) in rows"
                :key="rowIndex"
                data-slot="table-row"
                :class="[
                  striped && rowIndex % 2 === 1 ? 'bg-muted' : '',
                  !striped ? 'border-b' : '',
                ]"
              >
                <td
                  v-for="column in columns"
                  :key="column.key"
                  data-slot="table-cell"
                  class="px-4 py-2 align-middle"
                  :class="[
                    getAlignClass(column.align),
                    grid ? 'border-l first:border-l-0' : '',
                  ]"
                >
                  {{ row[column.key] }}
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
