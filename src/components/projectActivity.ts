import Autobind from '../decorators/autobind';
import Component from '../library/component';
import Project from '../models/project';
import { Draggable } from '../types/dragDrop';
import { InsertPosition } from '../types/projectEnums';

/**
 * Project Activity Component
 */
class ProjectActivity
  extends Component<HTMLDivElement, HTMLUListElement>
  implements Draggable
{
  /**
   *
   */
  private get getDescribePeople() {
    if (this.activityState.noOfPeople === 1) {
      return `${this.activityState.noOfPeople} person assigned.`;
    }

    return `${this.activityState.noOfPeople} persons assigned.`;
  }

  /**
   *
   * @param rootId Id of the stage this component is called i.e. activities, in-progress etc
   * @param activityState Activity items id, title, description, no of people etc;
   */
  constructor(rootId: string, private activityState: Project) {
    super(
      'project-activity',
      rootId,
      activityState.id,
      InsertPosition.AfterBegin
    );

    // Get the project stage ID
    this.configureEl();

    // Handle events
    this.addEvents();
  }

  /**
   * Drag Start Handler
   */
  @Autobind
  dragStartHandler(event: DragEvent): void {
    // Add the id of the element to the drag event
    event.dataTransfer!.setData('text/plain', this.activityState.id);

    // Add the move effect to the element
    event.dataTransfer!.effectAllowed = 'move';
  }

  /**
   * Drag End handler
   */
  @Autobind
  dragEndHandler(_1: DragEvent): void {
    // @TODO: Implement end state implementation
  }

  /**
   * Add events to the element
   */
  addEvents(): void {
    this.htmlEl.addEventListener('dragstart', this.dragStartHandler);
    this.htmlEl.addEventListener('dragend', this.dragEndHandler);
  }

  /**
   * Configure the html element
   */
  configureEl(): void {
    this.htmlEl.id = this.activityState.id;
    this.htmlEl.firstElementChild!.innerHTML = this.activityState.title;
    this.htmlEl.firstElementChild!.nextElementSibling!.innerHTML =
      this.activityState.description;
    this.htmlEl.lastElementChild!.innerHTML = this.getDescribePeople;

    [];
  }
}

export default ProjectActivity;
