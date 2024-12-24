export const MAX_TEXTAREA_HEIGHT = 150; // Maximum height in pixels

export function autoResizeTextarea(textarea: HTMLTextAreaElement, maxHeight: number = MAX_TEXTAREA_HEIGHT) {
  textarea.style.height = 'auto';
  const newHeight = Math.min(textarea.scrollHeight, maxHeight);
  textarea.style.height = `${newHeight}px`;
  textarea.style.overflowY = textarea.scrollHeight > maxHeight ? 'auto' : 'hidden';
}

