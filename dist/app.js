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
var AllowZero;
(function (AllowZero) {
    AllowZero[AllowZero["Allow"] = 0] = "Allow";
    AllowZero[AllowZero["Disallow"] = 1] = "Disallow";
})(AllowZero || (AllowZero = {}));
const validate = function (validateOptions) {
    const { value, fieldName, customMessage, required, maxLength, minLength, max, min, trim, allowZero, } = validateOptions;
    const validationBag = [];
    const manageValidationBag = (messageFields) => {
        const { validationStatus, validationType, fieldName, fieldValue, message } = messageFields;
        const validationStatusConstruct = {
            validationStatus,
            validationType,
            fieldName,
            fieldValue,
            message,
        };
        validationBag.push(validationStatusConstruct);
    };
    let trimmedValue = '';
    const capitalizeStr = (str) => {
        return `${str.charAt(0).toLocaleUpperCase()}${str
            .slice(1)
            .toLocaleLowerCase()}`;
    };
    if (trim && typeof value === 'string')
        trimmedValue = value.toString();
    if (required) {
        const isValid = allowZero && allowZero === AllowZero.Disallow && typeof value === 'number'
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
    if (minLength != null && typeof value === 'string') {
        const isValid = value.length >= minLength;
        if (!isValid) {
            const message = customMessage
                ? customMessage
                : `${capitalizeStr(fieldName)} input field must be above ${minLength} characters.`;
            manageValidationBag({
                validationStatus: isValid,
                validationType: 'minLength',
                fieldName: `${fieldName}`,
                fieldValue: trim ? trimmedValue : value,
                message,
            });
        }
    }
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
class ProjectList {
    constructor(type = 'active') {
        this.type = type;
        this.templateEl = document.getElementById('project-list');
        this.appRootEl = document.getElementById('app');
        const insertedDOMElement = document.importNode(this.templateEl.content, true);
        this.domEl = insertedDOMElement.firstElementChild;
        this.domEl.id = `${this.type}-projects`;
        this.configureDomEl();
        this.render();
    }
    configureDomEl() {
        const listId = `${this.type}-projects-list`;
        console.log(this.domEl.querySelector('h2'));
        this.domEl.querySelector('ul').id = listId;
        this.domEl.querySelector('h2').innerText = `${this.type.toLocaleUpperCase()} PROJECTS`;
    }
    render() {
        this.appRootEl.insertAdjacentElement('beforeend', this.domEl);
    }
}
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
    getValidationMessages(validationArr) {
        const messages = [];
        validationArr.forEach(vld => {
            if (!vld.validationStatus)
                messages.push(vld.message);
        });
        return messages;
    }
    getFormInputsAndValidate() {
        this.setFormInputsWithValues();
        const enteredTitle = this.titleInputValue;
        const enteredDescription = this.descriptionInputValue;
        const enteredPeople = +this.peopleInputValue;
        const validateTitle = {
            value: enteredTitle,
            fieldName: 'title',
            required: true,
            trim: true,
            minLength: 5,
        };
        const validateDescription = {
            value: enteredDescription,
            fieldName: 'description',
            trim: true,
            minLength: 10,
            maxLength: 300,
            required: true,
        };
        const validatePeople = {
            value: enteredPeople,
            fieldName: 'people',
            required: true,
            min: 1,
            max: 5,
            allowZero: AllowZero.Disallow,
        };
        const titleValidationMsgs = this.getValidationMessages(validate(validateTitle));
        const descriptionValidationMsgs = this.getValidationMessages(validate(validateDescription));
        const peopleValidationMsgs = this.getValidationMessages(validate(validatePeople));
        const validationMessages = [
            ...titleValidationMsgs,
            ...descriptionValidationMsgs,
            ...peopleValidationMsgs,
        ];
        if (validationMessages.length > 0) {
            alert(`Validation failed in the following Fields!\n${validationMessages.join('\n')}`);
        }
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
new ProjectInputs();
new ProjectList('active');
new ProjectList('finished');
//# sourceMappingURL=app.js.map