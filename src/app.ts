// Import CSS
import './app.css';

// App Code

// @TARGETS: General App Overview
// @DONE: #01. Add Project Form To the UI
// @TODO: #02. Add Project Lists to the UI (Active && Finished)
// @TODO: #03. Add A single Project to the screen
// @TODO: #04. Enable Drag and Drop of the Activities from one project Status i.e. active to finished and Vice Versa
// @TODO: #05. Refactor code to organized Folders
// @TODO: #06. Validate Project UI
// @TODO: #07. Manage Project State
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
// @TODO: Implement Project Store

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
      console.table({
        title,
        description,
        people,
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
