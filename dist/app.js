"use strict";
class ProjectInputs {
    constructor() {
        this.titleInputValue = '';
        this.descriptionInputValue = '';
        this.peopleInputValue = '';
        this.templateEl = document.getElementById('project-input');
        this.appRootEl = document.getElementById('app');
        const importedDomEl = document.importNode(this.templateEl.content, true);
        this.domEl = importedDomEl.firstElementChild;
        this.domEl.id = 'user-input';
        this.addEffects();
        this.render();
    }
    setFormInputsWithValues() {
        const formData = new FormData(this.domEl);
        const { title, description, people } = Object.fromEntries(formData);
        this.titleInputValue = title;
        this.descriptionInputValue = description;
        this.peopleInputValue = people;
    }
    getFormInputsAndValidate() {
        this.setFormInputsWithValues();
        const enteredTitle = this.titleInputValue;
        const enteredDescription = this.descriptionInputValue;
        const enteredPeople = +this.peopleInputValue;
        return [enteredTitle, enteredDescription, enteredPeople];
    }
    handleFormSubmit(event) {
        event.preventDefault();
        const validatedInputs = this.getFormInputsAndValidate();
        if (Array.isArray(validatedInputs)) {
            const [title, description, people] = validatedInputs;
            console.log({ title, description, people });
        }
    }
    render() {
        this.appRootEl.insertAdjacentElement('afterbegin', this.domEl);
    }
    addEffects() {
        document.addEventListener('submit', this.handleFormSubmit.bind(this));
    }
}
const projects = new ProjectInputs();
//# sourceMappingURL=app.js.map