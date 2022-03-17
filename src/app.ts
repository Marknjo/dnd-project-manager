// FIXME: Move different Features in different files
// TODO: Implement ProjectInput class, ProjectList class, ProjectItem class, base Component class, form Validator, Project Store class, base Store class, Implement Drag and Drop, Add relevant interfaces, and types and enums if any -> Draggable interface, Droppable interface, ProjectStatus (Enum), Project Class, Validatable

/// FIXME: IMPLEMENTATION -> remove this line

class ProjectInputs {
  templateEl: HTMLTemplateElement;
  appRootEl: HTMLDivElement;
  domEl: HTMLFormElement;

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

    /// Render the element on the UI
    this.render();
  }

  private render() {
    this.appRootEl.insertAdjacentElement('afterbegin', this.domEl);
  }
}

/// Initialize Project Imputs
const projects = new ProjectInputs();
