// Import CSS
import './app.css';

import { v4 as uuidV4 } from 'uuid';

// App Code

// @TARGETS: General App Overview
// @DONE: #01. Add Project Form To the UI
// @DONE: #02. Add Project Lists to the UI (Actvities && Finished)
// @DONE: #03. Add A single Project to the screen
// @DONE: #04. Enable Drag and Drop of the Activities from one project Status i.e. Activities to finished and Vice Versa
// @TODO: #05. Refactor code to organized Folders
// @DONE: #06. Validate Project UI
// @DONE: #07. Manage Project State
// @TODO: #08. Refactor Templating to Component - With State and Without State

/// @TARGETS: Task #01. Add Project Form To the UI
// @DONE: #01. Define HTML elments to grab, rootElement, templateElement, formElement
// @DONE: #02. Render the formElement to the UI
// @DONE: #03. Handle Form data submit, with validations included
// @DONE: #04. Handle SideEffects, events

/// Enums insertion position

/** ------------------------------------------------- */
//                    ENUMS TYPES                     //
/** ------------------------------------------------- */

/**
 * Html Element Insert Position
 */
enum InsertPosition {
  AfterBegin = 'afterbegin',
  AfterEnd = 'afterend',
  BeforeBegin = 'beforebegin',
  BeforeEnd = 'beforeend',
}

/**
 * Defines Different project stages status
 */
enum ProjectStageStatus {
  Activities = 'activities',
  InProgress = 'in-progress',
  Finished = 'finished',
  Stalled = 'stalled',
}

/** ------------------------------------------------- */
//                  INTERFACE TYPES                   //
/** ------------------------------------------------- */

/**
 * Interface to validate input field
 */
interface Validatable {
  field: string;
  value: string | number;
  trim?: boolean;
  message?: string;
  require?: boolean;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
}

/**
 * Validation Message Interface
 */
interface ValidatableMessages {
  isValid: boolean;
  message: string;
  field: string;
}

/**
 * Describes activity for submitted data
 */
interface ProjectPayload {
  title: string;
  description: string;
  noOfPeople: number;
}

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

/** ------------------------------------------------- */
//                    NORMAL TYPES                    //
/** ------------------------------------------------- */
/**
 * Define Project Listener Function
 */
type Listener = (store: Project[]) => void;

/** ------------------------------------------------- */
//                DECORATORS SECTION                  //
/** ------------------------------------------------- */

/**
 * Enable autodind feature to the events handlers
 */
const Autobind = (_: any, _1: string, descriptor: PropertyDescriptor) => {
  // Assign Default method
  const originalMethod = descriptor.value;

  // Autobind
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    get() {
      const boundFn = originalMethod.bind(this);

      return boundFn;
    },
  };

  // Return new method
  return adjDescriptor;
};

/** ------------------------------------------------- */
//               PROJECT STORE SECTION                //
/** ------------------------------------------------- */

// @TARGETS: Implement Project Store
// @DONE: #01: Create a class that defines project store
// @DONE: #02: The class should have listeners container
// @DONE: #03: The class should implement store for tracking submitted form data
// @DONE: #04: The class should be able to add actions creators to the lister container
// @DONE: #05: The Class should update store (Read, Remove, Delete etc)
// @DONE: #06: The class should use sigleton pattern to maintain data
// @DONE: #07: Refactor Project Class for a universal reusable store
// @DONE: #08: Define another class that defines the Project Fields (title, description, people, stage/status)

/**
 * Base State management class (abstract)
 **/
abstract class Store<P extends object, L extends Function> {
  /**
   * Tracts Submitted project items
   */
  store: P[] = [];

  /**
   * Tracks Submitted action creators
   */
  listeners: L[] = [];

  // Get Store content
  get getStore() {
    return this.store;
  }

  constructor() {}

  /**
   *
   * @param listenerFn A function that triggers and action
   */
  addListener(listenerFn: L) {
    this.listeners.push(listenerFn);
  }

  /**
   * Add Payload to the Project
   */
  addPayload(payload: P) {
    this.store.push(payload);

    // Update listeners that the store has been updated
    this.updateListeners();
  }

  /**
   * Project Listener
   */
  protected updateListeners() {
    this.listeners.forEach(listenerFn => {
      return listenerFn(this.store.slice());
    });
  }
}

/**
 * Define Project Structure
 */
class Project {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public noOfPeople: number,
    public projectStage: ProjectStageStatus
  ) {}
}

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

/** ------------------------------------------------- */
//               VALIDATIONS SECTION                  //
/** ------------------------------------------------- */

/// Utility Functions
/**
 * Capitalizer
 * @param word Word to capitalize
 * @returns Capitalized word
 */
const capitalizer = (word: string) => {
  return (
    word.charAt(0).toLocaleUpperCase() +
    word.toLocaleLowerCase().split('').slice(1).join('')
  );
};

/**
 * Validate imput fields
 */
const validate = (inputFieldOptions: Validatable): ValidatableMessages[] => {
  // set defaults
  let isValid = false;
  const validations: ValidatableMessages[] = [];

  // initialize input field options
  const { field, value, require, trim, min, max, minLength, maxLength } =
    inputFieldOptions;

  /**
   * Construc Validation Message
   */
  const validationHandler = (message: string, isValid: boolean) => {
    if (!isValid) {
      validations.push({
        message,
        isValid,
        field,
      });
    } else {
      validations.push({
        isValid: true,
        field,
        message: '',
      });
    }
  };

  /// Run Validations
  /// 1). Trim if field if provided
  let trimmedValue = '';
  if (trim) {
    trimmedValue = `${value}`.trim();
  }

  /// 2). Validate Required field
  if (require) {
    isValid = trim ? trimmedValue !== '' : value !== '';

    // Construct validation message
    const message = `${capitalizer(
      field
    )} field empty. Please provide it before you proceed.`;

    validationHandler(message, isValid);
  }

  /// 3). Validate Min --> Number
  if (min != null && typeof value === 'number') {
    isValid = trim ? parseInt(trimmedValue, 10) >= min : value >= min;

    // Construct validation message
    const message = `${capitalizer(
      field
    )} value must be above or equal to ${min}.`;
    validationHandler(message, isValid);
  }

  /// 4). Validate Max --> Number
  if (max != null && typeof value === 'number') {
    isValid = trim ? parseInt(trimmedValue, 10) <= max : value <= max;

    // Construct validation message
    const message = `${capitalizer(
      field
    )} value must be below or equal to ${min}.`;
    validationHandler(message, isValid);
  }

  /// 5). Validate Min Length
  if (minLength != null && typeof value === 'string') {
    isValid = trim
      ? trimmedValue.length >= minLength
      : value.length >= minLength;

    // Construct validation message
    const message = `Total number of characters in the ${capitalizer(
      field
    )} field must be above or equal to ${minLength}.`;
    validationHandler(message, isValid);
  }

  /// 6). Validate Max Length
  if (maxLength != null && typeof value === 'string') {
    isValid = trim
      ? trimmedValue.length <= maxLength
      : value.length <= maxLength;

    // Construct validation message
    const message = `Total number of characters in the ${capitalizer(
      field
    )} field must be below or equal to ${minLength}.`;
    validationHandler(message, isValid);
  }

  // Return either true or array of validation results
  return validations.filter(field => !field.isValid);
  //return validations;
};

/** ------------------------------------------------- */
//              HTML COMPONENTS SECTION               //
/** ------------------------------------------------- */

/**
 * Base Component Element/Template for all New Components
 */
abstract class Component<T extends HTMLElement, U extends HTMLElement> {
  /* Temaplate Element */
  templateEl: HTMLTemplateElement;

  /* Root Element Holder */
  rootEl: T;

  /* Element from the template */
  htmlEl: U;

  /* Component Constructor */
  constructor(
    templateElId: string,
    rootElId: string,
    public htmlElId: string,
    public insert: InsertPosition
  ) {
    this.templateEl = document.getElementById(
      templateElId
    )! as HTMLTemplateElement;

    this.rootEl = document.getElementById(rootElId)! as T;

    // Get the form component form the template elementt
    const componentTemplate = document.importNode(
      this.templateEl.content,
      true
    );

    this.htmlEl = componentTemplate.firstElementChild as U;

    // Add id to the form element
    this.htmlEl.id = htmlElId;

    // Render the Element to the UI
    this.render();
  }

  /** Add the element to the UI */
  private render() {
    this.rootEl.insertAdjacentElement(this.insert, this.htmlEl);
  }

  /// Other Enforceable Methods
  configureEl(): void {}

  addEvents(): void {}
}

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

/**
 * Implements Adding Different Project Stages In the UI
 */
class ProjectStage
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

    if (targetId!.includes('-list')) {
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

/**
 * Handle Adding Activities Form to UI
 */
class ActivityForm extends Component<HTMLDivElement, HTMLFormElement> {
  /// FORM INPUTS
  /** Title Inputs FormData */
  private activityTitle: FormDataEntryValue = '';

  /** Description Inputs FormData */
  private activityDescription: FormDataEntryValue = '';

  /** People Inputs FormData */
  private activityPeople: FormDataEntryValue = '';

  // Constructor
  constructor() {
    super(
      'project-activity-form',
      'root',
      'activity-form',
      InsertPosition.AfterBegin
    );

    // -> Handle Component Events
    this.eventsHandler();
  }

  // Public Methods

  // Private Methods
  /**
   * Clear form input if the activity/task is added successfully
   */
  private clearFormInputsOnSuccess() {
    const title = this.htmlEl.querySelector('#title') as HTMLInputElement;
    const description = this.htmlEl.querySelector(
      '#description'
    ) as HTMLInputElement;
    const people = this.htmlEl.querySelector('#people') as HTMLInputElement;
    description.value = '';
    title.value = '';
    people.value = '';
  }

  /**
   * Get submitted Activity/task and assign to activity form inputs properties
   */
  private getActivityFormInputs() {
    // Get form data
    const formData = new FormData(this.htmlEl);

    // Assign values to the
    this.activityTitle = formData.get('title') as FormDataEntryValue;
    this.activityDescription = formData.get(
      'description'
    ) as FormDataEntryValue;
    this.activityPeople = formData.get('people') as FormDataEntryValue;
  }

  /**
   * Gets a validation object, and construct messages for fields with errors.
   * @param validation Validation object containing - field name, error message, and whether the field is valid or not
   * @returns Constructed validation message.
   */
  private buildValidationMessage(validation: ValidatableMessages[]): string {
    let output = '';

    validation.forEach(
      titleErrorObj => (output += `${titleErrorObj.message}\n`)
    );

    const title = validation[0].field;

    return `${capitalizer(title)} Field Errors:\n${output}\n\n`;
  }

  /**
   *
   * Validate Activity Fields
   */
  private validateActivityFields() {
    const title = this.activityTitle.toString();
    const description = this.activityDescription.toString();
    const people = +this.activityPeople.toString();

    // Validate Title
    const validateTitle = validate({
      field: 'title',
      value: title,
      require: true,
      trim: true,
      minLength: 5,
    });

    /// Validate Description
    const validateDescription = validate({
      field: 'description',
      value: description,
      require: true,
      trim: true,
      minLength: 50,
      maxLength: 1000,
    });

    /// Validate People
    const validatePeople = validate({
      field: 'people',
      value: people,
      require: true,
      min: 1,
      max: 10,
    });

    let errorMessages = '';

    if (
      validateTitle.length > 0 ||
      validatePeople.length > 0 ||
      validatePeople.length > 0
    ) {
      // Build Ttile Error Message
      if (validateTitle.length > 0) {
        errorMessages += this.buildValidationMessage(validateTitle);
      }

      // Build Description Error Message
      if (validateDescription.length > 0) {
        errorMessages += this.buildValidationMessage(validateDescription);
      }

      // Build People Validation Error Message
      if (validatePeople.length > 0) {
        errorMessages += this.buildValidationMessage(validatePeople);
      }
    }

    /// Show validation messages
    // if (fieldErrorsMessages.length > 0) {
    if (errorMessages) {
      alert(`Fix the following validation errors\n${errorMessages}`);

      return;
    }

    return [title, description, people];
  }

  /** Submit project task */
  @Autobind
  private submitProjectActivityHandler(event: Event) {
    event.preventDefault();

    // Get form data
    this.getActivityFormInputs();

    // Validate Data
    /// Handle Validations
    const validations = this.validateActivityFields();

    if (validations) {
      const [title, description, people] = validations;

      // Submit to store
      projectState.addPayload({
        title: `${title}`,
        description: `${description}`,
        noOfPeople: +people,
      });

      // Update project store with the data
      this.clearFormInputsOnSuccess();
    }
  }

  private eventsHandler() {
    this.htmlEl.addEventListener('submit', this.submitProjectActivityHandler);
  }
}

/// Initialize activity Form
new ActivityForm();

/// Add project Status Stages to the UI
new ProjectStage(ProjectStageStatus.Stalled);
new ProjectStage(ProjectStageStatus.Finished);
new ProjectStage(ProjectStageStatus.InProgress);
new ProjectStage(ProjectStageStatus.Activities);
