export type Cell = {
  x: number;
  y: number;
  state: CellState;
};

export type CellAliveState = "alive" | "water";
export type CellDeadState = "desert";
export type CellEmptyState = "empty";

export type CellState = CellAliveState | CellDeadState | CellEmptyState;
