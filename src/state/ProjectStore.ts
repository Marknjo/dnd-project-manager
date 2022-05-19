/** ------------------------------------------------- */
//               PROJECT STORE SECTION                //
/** ------------------------------------------------- */
import { v4 as uuidV4 } from 'uuid';
import Store from '../library/store';
import Project from '../models/project';
import { ProjectStageStatus } from '../types/projectEnums';
import { Listener, ProjectPayload } from '../types/projectTypes';

// @TARGETS: Implement Project Store
// @DONE: #01: Create a class that defines project store
// @DONE: #02: The class should have listeners container
// @DONE: #03: The class should implement store for tracking submitted form data
// @DONE: #04: The class should be able to add actions creators to the lister container
// @DONE: #05: The Class should update store (Read, Remove, Delete etc)
// @DONE: #06: The class should use sigleton pattern to maintain data
// @DONE: #07: Refactor Project Class for a universal reusable store
// @DONE: #08: Define another class that defines the Project Fields (title, description, people, stage/status)

class ProjectStore extends Store<Project, Listener> {
  /**
   * Project Store Instance handle
   */
  private static instance: ProjectStore;

  // Get this instance
  static getInstance() {
    if (this.instance) {
      return this.instance;
    }

    this.instance = new ProjectStore();

    return this.instance;
  }

  // Constructor
  private constructor() {
    super();
  }

  /**
   * Add Payload to the Project
   */
  addPayload(payload: ProjectPayload) {
    // Push the content to the store
    const { title, description, noOfPeople } = payload;

    const newProjectActivity = new Project(
      uuidV4(),
      title,
      description,
      noOfPeople,
      ProjectStageStatus.Activities
    );

    this.store.push(newProjectActivity);

    // Update listeners that the store has been updated
    this.updateListeners();
  }

  /**
   * Swap project activity postion
   */
  updateProjectStage(activityId: string, newStage: ProjectStageStatus) {
    const foundActivity = this.store.find(
      activity => activity.id === activityId
    );

    // Update project stage
    if (foundActivity && foundActivity.projectStage !== newStage) {
      foundActivity.projectStage = newStage;

      this.updateListeners();
    }
  }
}

const projectState = ProjectStore.getInstance();

export default projectState;
