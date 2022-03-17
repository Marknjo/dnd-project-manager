// FIXME: Move different Features in different files
// TODO: Implement ProjectInput class, ProjectList class, ProjectItem class, base Component class, form Validator, Project Store class, base Store class, Implement Drag and Drop, Add relevant interfaces, and types and enums if any -> Draggable interface, Droppable interface, ProjectStatus (Enum), Project Class, Validatable

/// FIXME: IMPLEMENTATION -> remove this line

interface ProjectInputValues {
  title: string;
  description: string;
  people: number;
}

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

    /// TODO: Handle validations -> min, max, minLength, maxLength, required, isNumber

    /// Validation logic -> if no errors send the values

    return [enteredTitle, enteredDescription, enteredPeople];
  }

  /**
   * Handles form submission Event
   * @param {Event} event Event handler
   */
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
    // TODO: Implement @Autobind decorator
    document.addEventListener('submit', this.handleFormSubmit.bind(this));
  }
}

/// Initialize Project Imputs
const projects = new ProjectInputs();
