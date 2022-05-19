import Autobind from '../decorators/autobind';
import Component from '../library/component';
import Project from '../models/project';
import projectState from '../state/ProjectStore';
import { Droppable } from '../types/dragDrop';
import { InsertPosition, ProjectStageStatus } from '../types/projectEnums';
import ProjectActivity from './projectActivity';

/**
 * Implements Adding Different Project Stages In the UI
 */
class ProjectStages
  extends Component<HTMLDivElement, HTMLElement>
  implements Droppable
{
  /**
   * Tracks this Project stage activities
   */
  projectStageState: Project[] = [];

  /**
   * Droping area Project stage holder
   */
  droppingZoneStage: ProjectStageStatus = ProjectStageStatus.Activities;

  // Define constructor
  constructor(public projectStage: ProjectStageStatus) {
    super(
      'project-stage',
      'root',
      `projects-${projectStage}`,
      InsertPosition.AfterEnd
    );

    /// Listent to state changes
    projectState.addListener((store: Project[]) => {
      // Filter Projects Activities for the current project stage
      const stageProjectActivities = store.filter(projectActivity => {
        // Filter Activities Projects
        if (this.projectStage === ProjectStageStatus.Activities)
          return projectActivity.projectStage === this.projectStage;

        // Filter Finished Projects
        if (this.projectStage === ProjectStageStatus.Finished)
          return projectActivity.projectStage === this.projectStage;

        // Filter Projects in progress
        if (this.projectStage === ProjectStageStatus.InProgress)
          return projectActivity.projectStage === this.projectStage;

        // Filter Stalled projects activities
        if (this.projectStage === ProjectStageStatus.Stalled)
          return projectActivity.projectStage === this.projectStage;

        return projectActivity;
      });

      /// Update the current stage the found project activities
      this.projectStageState = stageProjectActivities;

      /// Show the project items to the UI
      this.renderActivity();
    });

    /// Confifure element
    this.configureEl();

    /// Listen to events
    this.addEvents();
  }

  /**
   * Show New Activity to UI
   */
  private renderActivity() {
    this.htmlEl.lastElementChild!.innerHTML = '';

    this.projectStageState.forEach(activity => {
      new ProjectActivity(`project-${this.projectStage}-list`, activity);
    });
  }

  /// DRAG EVENTS -> DROP AREA

  /**
   * Helper method that allows adding and removing of the project stage background
   * @param event Drag event holding the target element
   * @param add true to add a droppable bg class or false to remove it from the element
   */
  private toggleDropZonesBg(event: DragEvent, add: boolean) {
    const target = event.target as HTMLUListElement;
    const targetId = target.getAttribute('id');

    if (targetId?.includes('-list')) {
      if (add) {
        target.parentElement!.lastElementChild!.classList.add('droppable');
      } else {
        target.parentElement!.lastElementChild!.classList.remove('droppable');
      }
    }
  }

  /**
   * Enable Drapping of the item using drag over event
   */
  @Autobind
  dragOverHandler(event: DragEvent): void {
    // Allow dropping of items
    event.preventDefault();

    this.toggleDropZonesBg(event, true);
  }

  /**
   * Add styles using drag leave
   */
  @Autobind
  dragLeaveHandler(event: DragEvent): void {
    event.preventDefault();
    this.toggleDropZonesBg(event, false);
  }

  /**
   * Update the store by changing the status of the dragged activity
   */
  @Autobind
  dropHandler(event: DragEvent): void {
    event.preventDefault();
    const target = event.target as HTMLUListElement;
    const targetId = target.getAttribute('id');

    if (targetId!.includes('-list')) {
      const droppingZoneStage = target.parentElement!.dataset
        .projectStage as ProjectStageStatus;

      const activityId = event.dataTransfer!.getData('text/plain');

      // move the activity to the new target
      projectState.updateProjectStage(activityId, droppingZoneStage);

      // remove the bg color
      this.toggleDropZonesBg(event, false);
    }
  }

  // Listen to effects
  addEvents(): void {
    this.htmlEl.addEventListener('dragover', this.dragOverHandler);
    this.htmlEl.addEventListener('dragleave', this.dragLeaveHandler);
    this.htmlEl.addEventListener('drop', this.dropHandler);
  }

  // Configure Component
  configureEl(): void {
    const statusTitle = this.projectStage.split('-').join(' ');
    this.htmlEl.dataset.projectStage = this.projectStage;

    this.htmlEl.firstElementChild!.firstElementChild!.innerHTML = statusTitle;
    this.htmlEl.lastElementChild!.id = `project-${this.projectStage}-list`;
  }
}

export default ProjectStages;
