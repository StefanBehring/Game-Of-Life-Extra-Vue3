<template>
  <div class="playfield-container">
    <div class="playfield">
      <template v-for="cell in playfield" :key="`${cell.x}-${cell.y}`">
        <TheCell :cell="cell" :changeCellState="changeCellState" />
      </template>
    </div>

    <div class="selected-type" :class="selectedType"></div>

    <div class="toolbar">
      <button class="empty" @click="selectedType = 'empty'">Empty</button>
      <button class="alive" @click="selectedType = 'alive'">Alive</button>
      <button class="water" @click="selectedType = 'water'">Water</button>
      <button class="desert" @click="selectedType = 'desert'">Desert</button>
    </div>

    <div class="settings">
      <div class="settings-item">
        <label for="width">Width</label>
        <input type="number" id="width" v-model="width" />
      </div>
      <div class="settings-item">
        <label for="height">Height</label>
        <input type="number" id="height" v-model="height" />
      </div>
    </div>

    <div class="generation">Generation: {{ generation }}</div>
    <div class="buttons">
      <button class="button-reset" @click="resetPlayfield">
        Reset Playfield
      </button>
      <button class="button-next" @click="nextGeneration">
        Next Generation
      </button>
      <button class="button-auto-run" @click="autoRun">
        {{ isAutoRunning ? "Stop Auto Run" : "Start Auto Run" }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { usePlayfield } from "@/composables/usePlayfield";
import TheCell from "./TheCell.vue";
import type { CellState } from "@/types/Cell";

const {
  isAutoRunning,
  playfield,
  width,
  height,
  generation,
  getIndex,
  createPlayfield,
  nextGeneration,
  autoRun,
  resetPlayfield,
} = usePlayfield();

const selectedType = ref<CellState>("empty");

function changeCellState(xPos: number, yPos: number) {
  const index = getIndex(xPos, yPos);
  if (index === null) return;
  const cell = playfield.value[index];
  if (cell) {
    playfield.value[index!] = { ...cell, state: selectedType.value };
  }
}

onMounted(() => {
  createPlayfield();
});
</script>

<style scoped>
.playfield-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.playfield {
  display: grid;
  grid-template-columns: repeat(v-bind(width), 3rem);
  grid-template-rows: repeat(v-bind(height), 3rem);
}
.selected-type {
  width: 3rem;
  height: 3rem;
  border: 1px solid var(--color-grid);
  border-radius: 0.5rem;
  margin: 1rem 0;
}
.toolbar {
  display: flex;
  gap: 1rem;
}
.toolbar button {
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--color-font);
  border: 1px solid var(--color-grid);
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
}
.empty {
  background-color: var(--cell-empty);
}
.alive {
  background-color: var(--cell-alive);
}
.water {
  background-color: var(--cell-water);
}
.desert {
  background-color: var(--cell-desert);
}
.settings {
  display: flex;
  gap: 1rem;
  margin: 2rem 0;
}
.settings-item {
  display: flex;
  flex-direction: column;
}
.settings-item label {
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--color-font);
  margin-bottom: 0.5rem;
}
.settings-item input {
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--color-font);
  background-color: var(--color-grid);
  border: 1px solid var(--color-bg);
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
}
.generation {
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--color-font);
  margin: 1rem 0;
}
.buttons {
  display: flex;
  gap: 1rem;
}
.button-reset {
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--color-font);
  background-color: var(--color-grid);
  border: 1px solid var(--color-bg);
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
}
.button-next {
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--color-font);
  background-color: var(--color-grid);
  border: 1px solid var(--color-bg);
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
}
.button-auto-run {
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--color-font);
  background-color: var(--color-grid);
  border: 1px solid var(--color-bg);
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
}
button:hover {
  cursor: pointer;
}
</style>
