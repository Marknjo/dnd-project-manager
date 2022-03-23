// FIXME: Move different Features in different files
// TODO: Implement ProjectInput class, ProjectList class, ProjectItem class, base Component class, form Validator, Project Store class, base Store class, Implement Drag and Drop, Add relevant interfaces, and types and enums if any -> Draggable interface, Droppable interface, ProjectStatus (Enum), Project Class, Validatable

/// FIXME: IMPLEMENTATION -> remove this line

/**
 * Automatically binds the method with this
 * @param _ Target Prototype
 * @param _2 Method name
 * @param descriptor Property descriptor of the method implementing the class
 * @returns Property descriptor
 */
const Autobind = function (_: any, _2: string, descriptor: PropertyDescriptor) {
  // Get the descriptor value
  const originalMethod = descriptor.value;

  // Assign bind using get
  const adjustedDescriptor: PropertyDescriptor = {
    configurable: true,
    get() {
      return originalMethod.bind(this);
    },
  };

  // return adjusted Descriptor
  return adjustedDescriptor;
};

/**
 * A guard to allow a number field to be either 0 or non-zero
 * @argument 'Allow' | 'Disallow' zeros for numerical fields
 */
enum AllowZero {
  'Allow',
  'Disallow',
}

/**
 * An interface enforcinng all fields an input can use to validate
 * @param value The actual value submitted by the input form
 * @param fieldName The name of the input form field
 * @param required  Enforces a field must be present
 * @param maxLength Enforces maximum characters allowable for string values
 * @param minLength Enforces a maxLength value for string values
 * @param max Enforces a max value for a numeric input field
 * @param min Enforces a min value for a numeric input field
 * @param allowZero Declares if an input field allows a zero as input or not -> Type AllowZero ("Allow | Disallow")
 * @param trim trims an input field
 * @param customMessage Sets a custom message for a field
 */
interface Validatable {
  value: string | number;
  fieldName: string;
  customMessage?: string;
  required?: boolean;
  maxLength?: number;
  minLength?: number;
  trim?: boolean;
  max?: number;
  min?: number;
  allowZero?: AllowZero;
}

/**
 * Enforces return types for a validation message response
 * @param validationStatus Either a true or false
 * @param validationType One of the fields Validatable interface implements i.e. required, value e.t.c
 * @param fieldName The field name of the input form validations are run
 * @param fieldValue Actual value user submitted
 * @param message A custom field carrying the validation error message
 */
interface Messagable {
  validationStatus: boolean;
  validationType: string;
  fieldName: string;
  fieldValue: string | number;
  message: string;
}

/**
 * Validate Input fields
 * @param validateOptions Type Validatable parameters
 * @returns an empty array or validation configuration of type Messagable
 */
const validate = function (validateOptions: Validatable): Messagable[] {
  // Initialize validator

  const {
    value,
    fieldName,
    customMessage,
    required,
    maxLength,
    minLength,
    max,
    min,
    trim,
    allowZero,
  } = validateOptions;

  /// Messaging bag
  const validationBag: Messagable[] = [];

  /**
   * Pushes error messages to validation bag
   * @param messageFields Implements messagable interface
   */
  const manageValidationBag = (messageFields: Messagable) => {
    const { validationStatus, validationType, fieldName, fieldValue, message } =
      messageFields;

    const validationStatusConstruct: Messagable = {
      validationStatus,
      validationType,
      fieldName,
      fieldValue,
      message,
    };

    validationBag.push(validationStatusConstruct);
  };

  let trimmedValue = '';

  /// Validations logic

  /**
   * Capitalize first letter
   * @param str A string of any types
   * @returns A capitalized string
   */
  const capitalizeStr = (str: string) => {
    return `${str.charAt(0).toLocaleUpperCase()}${str
      .slice(1)
      .toLocaleLowerCase()}`;
  };

  // Trim a value ony if it is a string
  if (trim && typeof value === 'string') trimmedValue = value.toString();

  /// Check required
  if (required) {
    const isValid =
      allowZero && allowZero === AllowZero.Disallow && typeof value === 'number'
        ? value.toString().trim().length !== 0 && value !== 0
        : value.toString().trim().length !== 0;

    if (!isValid) {
      const message = customMessage
        ? customMessage
        : `${capitalizeStr(fieldName)} input field has no value.`;

      manageValidationBag({
        validationStatus: isValid,
        validationType: 'required',
        fieldName: `${fieldName}`,
        fieldValue: trim ? trimmedValue : value,
        message,
      });
    }
  }

  // validate is maxLength value
  if (typeof value === 'string' && maxLength != null) {
    const isValid = value.length <= maxLength;

    if (!isValid) {
      const message = customMessage
        ? customMessage
        : `${capitalizeStr(fieldName)} input field must be below ${maxLength}.`;

      manageValidationBag({
        validationStatus: isValid,
        validationType: 'maxLength',
        fieldName: `${fieldName}`,
        fieldValue: trim ? trimmedValue : value,
        message,
      });
    }
  }

  // validate is minLength value
  if (minLength != null && typeof value === 'string') {
    const isValid = value.length >= minLength;

    if (!isValid) {
      const message = customMessage
        ? customMessage
        : `${capitalizeStr(
            fieldName
          )} input field must be above ${minLength} characters.`;

      manageValidationBag({
        validationStatus: isValid,
        validationType: 'minLength',
        fieldName: `${fieldName}`,
        fieldValue: trim ? trimmedValue : value,
        message,
      });
    }
  }

  // Validate is max value
  if (max != null && typeof value === 'number') {
    const isValid = value <= max;

    if (!isValid) {
      const message = customMessage
        ? customMessage
        : `${capitalizeStr(fieldName)} input field must be below ${max}.`;

      manageValidationBag({
        validationStatus: isValid,
        validationType: 'max',
        fieldName: `${fieldName}`,
        fieldValue: value,
        message,
      });
    }
  }

  // Validate is min value
  if (min != null && typeof value === 'number') {
    const isValid = value >= min;

    if (!isValid) {
      const message = customMessage
        ? customMessage
        : `${capitalizeStr(fieldName)} input field must be more than ${min}.`;

      manageValidationBag({
        validationStatus: isValid,
        validationType: 'min',
        fieldName: `${fieldName}`,
        fieldValue: value,
        message,
      });
    }
  }

  return validationBag;
};

/**
 * Project input Class -> Responsible for rendering project adding form
 */
class ProjectInputs {
  /**
   * @property Gets the template holding the form element
   */
  templateEl: HTMLTemplateElement;

  /**
   * @property App root container
   */
  appRootEl: HTMLDivElement;

  /**
   * @property stores/holds the form element
   */
  domEl: HTMLFormElement;

  ///// Handle Form Inputs

  /**
   * @property Holds the form title input value
   */
  titleInputValue: FormDataEntryValue = '';

  /**
   * @property holds the form description input value
   */
  descriptionInputValue: FormDataEntryValue = '';

  /**
   * @property holds the form people input value
   */
  peopleInputValue: FormDataEntryValue = '';

  /**
   * Initializes project inputs on login
   */
  constructor() {
    /// Get template on class initialization
    this.templateEl = document.getElementById(
      'project-input'
    )! as HTMLTemplateElement;

    /// Get App Root
    this.appRootEl = document.getElementById('app')! as HTMLDivElement;

    /// get imported DOM Element
    const importedDomEl = document.importNode(this.templateEl.content, true);

    this.domEl = importedDomEl.firstElementChild as HTMLFormElement;

    this.domEl.id = 'user-input';

    /// Add elements to the form

    /// Handle events handlers
    this.addEffects();

    /// Render the element on the UI
    this.render();
  }

  /**
   * Sets form properties with submitted values -> title, description, people
   * Utilizes FormData
   */
  private setFormInputsWithValues() {
    const formData = new FormData(this.domEl);
    const { title, description, people } = Object.fromEntries(formData);

    this.titleInputValue = title;
    this.descriptionInputValue = description;
    this.peopleInputValue = people;
  }

  private showValidationNotification(validationArr: Messagable[]) {
    const messages: string[] = [];
    validationArr.forEach(vld => {
      if (!vld.validationStatus) messages.push(vld.message);
    });

    return messages;
  }

  /**
   * Gets user input values
   * @returns {[string, string, number] | void} A tuple of title, description, people or void
   */
  private getFormInputsAndValidate(): [string, string, number] | void {
    // Extract input values
    /// SetProject input values -> title, description, and people
    this.setFormInputsWithValues();

    /// Assign values
    const enteredTitle = this.titleInputValue as string;
    const enteredDescription = this.descriptionInputValue as string;
    const enteredPeople = +this.peopleInputValue as number;

    /// TODO: Handle validations -> trim, min, max, minLength, maxLength, required, isNumber
    const validateTitle: Validatable = {
      value: enteredTitle,
      fieldName: 'title',
      required: true,
      trim: true,
      minLength: 5,
    };

    const validateDescription: Validatable = {
      value: enteredDescription,
      fieldName: 'description',
      trim: true,
      minLength: 10,
      maxLength: 300,
      required: true,
    };

    const validatePeople: Validatable = {
      value: enteredPeople,
      fieldName: 'people',
      required: true,
      min: 1,
      max: 5,
      allowZero: AllowZero.Disallow,
    };

    /// Validation logic -> if no errors send the value
    /// TODO: Handle field validations individually for appropriete error response

    // Handle validations -> Title
    const titleValidationMsgs = this.showValidationNotification(
      validate(validateTitle)
    );

    // Handle validations -> Description
    const descriptionValidationMsgs = this.showValidationNotification(
      validate(validateDescription)
    );

    // Handle validations -> People
    const peopleValidationMsgs = this.showValidationNotification(
      validate(validatePeople)
    );

    // Allvalidations
    const validationMessages = [
      ...titleValidationMsgs,
      ...descriptionValidationMsgs,
      ...peopleValidationMsgs,
    ];

    if (validationMessages.length > 0) {
      alert(
        `Validation failed in the following Fields!\n${validationMessages.join(
          '\n'
        )}`
      );
    }

    return [enteredTitle, enteredDescription, enteredPeople];
  }

  /**
   * Handles form submission Event
   * @param {Event} event Event handler
   */
  @Autobind
  private handleFormSubmit(event: Event) {
    // Prevent default
    event.preventDefault();

    // get the form input values: Event listener submit
    const validatedInputs = this.getFormInputsAndValidate();

    // Put the content to the store -> Requires a store to handle form submit
    if (Array.isArray(validatedInputs)) {
      const [title, description, people] = validatedInputs;

      /// TODO: Send project item to the store
      console.log({ title, description, people });
    }
  }

  /**
   * Renders DOM element to the UI
   */
  private render() {
    this.appRootEl.insertAdjacentElement('afterbegin', this.domEl);
  }

  /**
   *  Add events listeners to the dom El
   *  // TODO: Enforce it during extending the class
   */
  private addEffects() {
    /// Event listener handling form submission
    document.addEventListener('submit', this.handleFormSubmit);
  }
}

/// Initialize Project Imputs
const projects = new ProjectInputs();
