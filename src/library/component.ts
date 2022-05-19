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

export default Component;
