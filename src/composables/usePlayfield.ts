import { ref, watch, onUnmounted } from "vue";
import type { Cell, CellAliveState, CellState } from "@/types/Cell";
import type { Playfield } from "@/types/Playfield";

export function usePlayfield() {
  const boundaries = {
    min: 1,
    max: 20,
  };
  const autoRunInterval = 500;

  const isAutoRunning = ref(false);
  const playfield = ref<Playfield>([]);
  const aliveStates: readonly CellAliveState[] = ["alive", "water"];
  const width = ref(10);
  const height = ref(10);
  const generation = ref(0);
  const intervalId = ref<ReturnType<typeof setInterval> | null>(null);

  /**
   * Starts or stops the automatic generation of the next generation.
   */
  function autoRun() {
    if (intervalId.value) {
      clearInterval(intervalId.value);
      intervalId.value = null;
      isAutoRunning.value = false;
    } else {
      intervalId.value = setInterval(() => {
        nextGeneration();
      }, autoRunInterval);
      isAutoRunning.value = true;
    }
  }

  /**
   * Creates a new playfield with the current width and height.
   */
  function createPlayfield() {
    const newPlayfield: Playfield = new Array(width.value * height.value);
    for (let x = 0; x < width.value; x++) {
      for (let y = 0; y < height.value; y++) {
        const newCell: Cell = {
          x,
          y,
          state: "empty",
        };
        const index = getIndex(x, y);
        newPlayfield[index!] = newCell;
      }
    }
    playfield.value = newPlayfield;
  }

  /**
   * Returns the neighbors of a cell.
   * @param currentCell - The current cell.
   * @returns The neighbors of the cell which are not out of bounds.
   */
  function getCellNeighbors(currentCell: Cell) {
    const x = currentCell.x;
    const y = currentCell.y;

    const neighbors: Cell[] = [];

    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) continue;
        const index = getIndex(x + i, y + j);
        if (index === null) continue;
        const neighbor = playfield.value[index];
        if (neighbor) {
          neighbors.push(neighbor);
        }
      }
    }

    return neighbors;
  }

  /**
   * Returns the index of a cell in the playfield or null if the cell is out of bounds.
   * @param x - The x coordinate of the cell.
   * @param y - The y coordinate of the cell.
   * @returns The index of the cell in the playfield or null if the cell is out of bounds.
   */
  function getIndex(x: number, y: number) {
    if (x < 0 || x >= width.value || y < 0 || y >= height.value) {
      return null;
    }
    return y * width.value + x;
  }

  /**
   * Checks if a cell state is an alive state.
   * @param state - The state of the cell.
   * @returns True if the state is an alive state, false otherwise.
   */
  function isAliveState(state: CellState): state is CellAliveState {
    return aliveStates.includes(state as CellAliveState);
  }

  /**
   * Returns the new state of a cell.
   * @param currentCell - The current cell.
   * @param neighbors - The neighbors of the cell.
   * @returns The new state of the cell.
   */
  function getNewCellState(currentCell: Cell, neighbors: Cell[]) {
    const aliveNeighbors = neighbors.filter((neighbor) =>
      isAliveState(neighbor.state)
    ).length;

    switch (currentCell.state) {
      case "alive":
        return aliveNeighbors >= 2 && aliveNeighbors <= 3
          ? "alive"
          : aliveNeighbors === 8
          ? "water"
          : "empty";
      case "desert":
        return "desert";
      case "water":
        return "water";
      case "empty":
      default:
        return aliveNeighbors === 3 ? "alive" : "empty";
    }
  }

  /**
   * Generates the next generation of the playfield.
   */
  function nextGeneration() {
    const newPlayfield: Playfield = new Array(width.value * height.value);
    for (let x = 0; x < width.value; x++) {
      for (let y = 0; y < height.value; y++) {
        const index = getIndex(x, y);
        if (index === null) continue;
        const currentCell = playfield.value[index];
        if (!currentCell) continue;
        const neighbors = getCellNeighbors(currentCell);
        const newCellState = getNewCellState(currentCell, neighbors);
        newPlayfield[index] = { ...currentCell, state: newCellState };
      }
    }
    playfield.value = newPlayfield;
    generation.value++;
  }

  /**
   * Resets the playfield to the initial state.
   */
  function resetPlayfield() {
    if (intervalId.value) {
      clearInterval(intervalId.value);
      intervalId.value = null;
      isAutoRunning.value = false;
    }
    generation.value = 0;
    createPlayfield();
  }

  watch([height, width], ([newH, newW]) => {
    const clampedH = Math.max(boundaries.min, Math.min(newH, boundaries.max));
    const clampedW = Math.max(boundaries.min, Math.min(newW, boundaries.max));

    const changedH = clampedH !== newH;
    const changedW = clampedW !== newW;

    if (changedH) height.value = clampedH;
    if (changedW) width.value = clampedW;

    if (changedH || changedW) {
      resetPlayfield();
    }
  });

  onUnmounted(() => {
    if (intervalId.value) {
      clearInterval(intervalId.value);
      intervalId.value = null;
    }
  });

  return {
    isAutoRunning,
    playfield,
    width,
    height,
    generation,
    autoRun,
    getIndex,
    createPlayfield,
    nextGeneration,
    resetPlayfield,
  };
}
