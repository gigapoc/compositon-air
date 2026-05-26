export type UiState = 'exploring' | 'sheetOpen';

let uiState: UiState = 'exploring';

export function getUiState(): UiState {
  return uiState;
}

export function setUiState(state: UiState): void {
  uiState = state;
}
