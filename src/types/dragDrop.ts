/**
 * Contracts for the component which is can be dragged
 */
interface Draggable {
  dragStartHandler(event: DragEvent): void;
  dragEndHandler(event: DragEvent): void;
}

/**
 * Contracts for the components which receives a dragged Item
 */
interface Droppable {
  dragOverHandler(event: DragEvent): void;
  dragLeaveHandler(event: DragEvent): void;
  dropHandler(event: DragEvent): void;
}

export type { Draggable, Droppable };
