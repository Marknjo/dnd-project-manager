"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
const Autobind = function (_, _2, descriptor) {
    const originalMethod = descriptor.value;
    const adjustedDescriptor = {
        configurable: true,
        get() {
            return originalMethod.bind(this);
        },
    };
    return adjustedDescriptor;
};
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
        document.addEventListener('submit', this.handleFormSubmit);
    }
}
__decorate([
    Autobind
], ProjectInputs.prototype, "handleFormSubmit", null);
const projects = new ProjectInputs();
//# sourceMappingURL=app.js.map