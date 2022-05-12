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

interface ValidatableMessages {
  isValid: boolean;
  message: string;
  field: string;
}

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

  const capitalize = (word: string) => {
    return (
      word.charAt(0).toLocaleUpperCase() +
      word.toLocaleLowerCase().split('').slice(1).join('')
    );
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
    const message = `${capitalize(
      field
    )} field empty. Please provide it before you proceed.`;

    validationHandler(message, isValid);
  }

  /// 3). Validate Min --> Number
  if (min != null && typeof value === 'number') {
    isValid = trim ? parseInt(trimmedValue, 10) >= min : value >= min;

    // Construct validation message
    const message = `${capitalize(
      field
    )} value must be above or equal to ${min}.`;
    validationHandler(message, isValid);
  }

  /// 4). Validate Max --> Number
  if (max != null && typeof value === 'number') {
    isValid = trim ? parseInt(trimmedValue, 10) <= max : value <= max;

    // Construct validation message
    const message = `${capitalize(
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
    const message = `Total number of characters in the ${capitalize(
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
    const message = `Total number of characters in the ${capitalize(
      field
    )} field must be below or equal to ${minLength}.`;
    validationHandler(message, isValid);
  }

  // Return either true or array of validation results
  return validations;
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

  /**
   *
   * Validate Activity Fields
   */
  private validateActivityFields() {
    const title = this.activityTitle.toString();
    const description = this.activityDescription.toString();
    const people = +this.activityPeople.toString();

    // Field errors container
    const fieldErrorsMessages: string[] = [];

    // Validate Title
    const validateTitle = validate({
      field: 'title',
      value: title,
      require: true,
      trim: true,
      minLength: 5,
    });

    const titleIsValid = validateTitle.filter(
      validation => !validation.isValid
    );

    if (titleIsValid.length > 0) {
      titleIsValid.forEach(titleErrorObj =>
        fieldErrorsMessages.push(titleErrorObj.message)
      );
    }

    /// Validate Description
    const validateDescription = validate({
      field: 'description',
      value: description,
      require: true,
      trim: true,
      minLength: 50,
      maxLength: 1000,
    });

    const descriptionIsValid = validateDescription.filter(
      validation => !validation.isValid
    );

    if (descriptionIsValid.length > 0) {
      descriptionIsValid.forEach(titleErrorObj =>
        fieldErrorsMessages.push(titleErrorObj.message)
      );
    }

    /// Validate People
    const validatePeople = validate({
      field: 'people',
      value: people,
      require: true,
      min: 1,
      max: 10,
    });

    const peopleIsValid = validatePeople.filter(
      validation => !validation.isValid
    );

    if (peopleIsValid.length > 0) {
      peopleIsValid.forEach(titleErrorObj =>
        fieldErrorsMessages.push(titleErrorObj.message)
      );
    }

    /// Show validation messages
    if (fieldErrorsMessages.length > 0) {
      const messages = fieldErrorsMessages.join('\n');
      alert(`Validation Errors\n\n${messages}`);

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
