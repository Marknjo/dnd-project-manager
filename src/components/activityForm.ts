import Autobind from '../decorators/autobind';
import Component from '../library/component';
import projectState from '../state/ProjectStore';
import { InsertPosition } from '../types/projectEnums';
import { ValidatableMessages } from '../types/projectTypes';
import capitalizer from '../utils/capitalizer';
import validate from '../utils/validations';

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

export default ActivityForm;
