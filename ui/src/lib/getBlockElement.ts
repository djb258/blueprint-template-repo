/**
 * Utility function to get a DOM element by its block ID
 * @param id - The block ID to search for
 * @returns The HTML element or null if not found
 */
export function getBlockElement(id: string): HTMLElement | null {
  return document.querySelector(`[data-block-id='${id}']`);
}

/**
 * Get all elements with block IDs
 * @returns Array of all elements with data-block-id attributes
 */
export function getAllBlockElements(): HTMLElement[] {
  return Array.from(document.querySelectorAll('[data-block-id]'));
}

/**
 * Check if a block ID exists in the DOM
 * @param id - The block ID to check
 * @returns True if the block exists
 */
export function blockExists(id: string): boolean {
  return getBlockElement(id) !== null;
}
