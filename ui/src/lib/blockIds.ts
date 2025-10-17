// Centralized Block ID Registry for Blueprint Engine Console
// Use these IDs to target specific UI blocks for edits

export const BLOCK_IDS = {
  // Header blocks
  HEADER_MAIN: 'header-main-001',
  
  // Left Panel blocks
  GPT_PANEL: 'gpt-panel-001',
  GPT_HEADER: 'gpt-header-002',
  GPT_LAUNCH: 'gpt-launch-003',
  
  // Right Panel blocks
  ENGINE_PANEL: 'engine-panel-001',
  ENGINE_HEADER: 'engine-header-002',
  ENGINE_STATUS: 'engine-status-003',
  ENGINE_PROJECT_INPUT: 'engine-project-input-004',
  ENGINE_JSON_INPUT: 'engine-json-input-005',
  ENGINE_ACTIONS: 'engine-actions-006',
  ENGINE_PROGRESS: 'engine-progress-007',
  ENGINE_OUTPUT_LIST: 'engine-output-list-008',
  ENGINE_PROMOTION: 'engine-promotion-009',
  ENGINE_FOOTER: 'engine-footer-010',
  
  // Console layout
  CONSOLE_MAIN: 'console-main-001',
  CONSOLE_GRID: 'console-grid-002',
  EDIT_MODE_BUTTON: 'edit-mode-button-001',
} as const;

export type BlockId = typeof BLOCK_IDS[keyof typeof BLOCK_IDS];
