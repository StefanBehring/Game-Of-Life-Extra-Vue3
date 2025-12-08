<template>
  <div
    class="cell"
    :class="cellClass"
    @click="changeCellState(cell.x, cell.y)"
  ></div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { Cell } from "@/types/Cell";

const props = defineProps<{
  cell: Cell;
  changeCellState: (xPos: number, yPos: number) => void;
}>();

const cellClass = computed(() => {
  return `cell-${props.cell.state.toLowerCase()}`;
});
</script>

<style scoped>
.cell {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  border: 1px solid var(--color-grid);
  color: var(--color-font);
}
.cell:hover {
  cursor: pointer;
  border: 1px solid var(--color-font);
}
.cell-empty {
  background-color: var(--cell-empty);
}
.cell-alive {
  background-color: var(--cell-alive);
}
.cell-water {
  background-color: var(--cell-water);
}
.cell-desert {
  background-color: var(--cell-desert);
}
</style>
