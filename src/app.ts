// Import CSS
import './app.css';

// App Code

// @TARGETS: General App Overview
// @TODO: #01. Add Project Form To the UI
// @TODO: #02. Add Project Lists to the UI (Active && Finished)
// @TODO: #03. Add A single Project to the screen
// @TODO: #04. Enable Drag and Drop of the Activities from one project Status i.e. active to finished and Vice Versa
// @TODO: #05. Refactor code to organized Folders
// @TODO: #06. Validate Project UI
// @TODO: #07. Manage Project State
// @TODO: #08. Refactor Templating to Component - With State and Without State

/// @TARGETS: Task #01. Add Project Form To the UI
// @TODO: #01. Define HTML elments to grab, rootElement, templateElement, formElement
// @TODO: #02. Render the formElement to the UI
// @TODO: #03. Handle Form data submit, with validations included
// @TODO: #04. Handle SideEffects, events

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

/**
 * Handle Adding Activities Form to UI
 */
class ActivityForm {
  /** The root element */
  protected rootEl: HTMLDivElement;

  /** The Form Element */
  protected templateEl: HTMLTemplateElement;

  /** The Activity Form Template Element */
  protected componentEl: HTMLFormElement;

  /// FORM INPUTS
  /** Title Inputs FormData */
  private activityTitle: FormDataEntryValue = '';

  /** Description Inputs FormData */
  private activityDescription: FormDataEntryValue = '';

  /** People Inputs FormData */
  private activityPeople: FormDataEntryValue = '';

  // Constructor
  constructor() {
    this.rootEl = document.getElementById('root')! as HTMLDivElement;
    this.templateEl = document.getElementById(
      'project-activity-form'
    )! as HTMLTemplateElement;

    // Get the form component form the template elementt
    const formComponentTemplate = document.importNode(
      this.templateEl.content,
      true
    );
    this.componentEl =
      formComponentTemplate.firstElementChild as HTMLFormElement;

    // Add id to the form element
    this.componentEl.id = 'activity-form';

    // Add initial Methods here i.e. render, configureEvents
    // -> Render Activity form element to the UI
    this.render();

    // -> Handle Component Events
    this.eventsHandler();
  }

  // Public Methods

  // Private Methods
  /**
   * Clear form input if the activity/task is added successfully
   */
  private clearFormInputsOnSuccess() {
    this.componentEl.description.value = '';
    const title = this.componentEl.querySelector('#title') as HTMLInputElement;
    title.value = '';
    this.componentEl.people.value = '';
  }

  /**
   * Get submitted Activity/task and assign to activity form inputs properties
   */
  private getActivityFormInputs() {
    // Get form data
    const formData = new FormData(this.componentEl);

    // Assign values to the
    this.activityTitle = formData.get('title') as FormDataEntryValue;
    this.activityDescription = formData.get(
      'description'
    ) as FormDataEntryValue;
    this.activityPeople = formData.get('people') as FormDataEntryValue;
  }

  /** Submit project task */
  @Autobind
  private submitProjectActivityHandler(event: Event) {
    event.preventDefault();

    // Get form data
    this.getActivityFormInputs();

    // Validate Data
    console.table({
      title: this.activityTitle,
      description: this.activityDescription,
      people: this.activityPeople,
    });

    // Update project store with the data
    this.clearFormInputsOnSuccess();
  }

  private eventsHandler() {
    this.componentEl.addEventListener(
      'submit',
      this.submitProjectActivityHandler
    );
  }

  /** Add the activity form to the UI */
  private render() {
    this.rootEl.insertAdjacentElement('afterbegin', this.componentEl);
  }
}

/// Initialize activity Form
new ActivityForm();
