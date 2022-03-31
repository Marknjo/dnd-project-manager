"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ProjectStatus;
(function (ProjectStatus) {
    ProjectStatus["Active"] = "active";
    ProjectStatus["Finished"] = "finished";
})(ProjectStatus || (ProjectStatus = {}));
var Insertable;
(function (Insertable) {
    Insertable["BeforeBegin"] = "beforebegin";
    Insertable["BeforeEnd"] = "beforeend";
    Insertable["AfterBegin"] = "afterbegin";
    Insertable["AfterEnd"] = "afterend";
})(Insertable || (Insertable = {}));
class Project {
    constructor(id, title, description, noOfPeople, status) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.noOfPeople = noOfPeople;
        this.status = status;
    }
}
class Store {
    constructor() {
        this.store = [];
        this.listeners = [];
    }
    get getStore() {
        return this.store;
    }
    addlistener(listenerFn) {
        this.listeners.push(listenerFn);
    }
    updateListener() {
        this.listeners.forEach(listenerFn => {
            listenerFn(this.store.slice());
        });
    }
}
class ProjectStore extends Store {
    constructor() {
        super();
    }
    static getInstance() {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new ProjectStore();
        return this.instance;
    }
    addPayload(payload) {
        const { title, description, noOfPeople } = payload;
        const projectItem = new Project(Math.random().toString(), title, description, noOfPeople, ProjectStatus.Active);
        this.store.push(projectItem);
        this.updateListener();
    }
    moveProjectItem(activityId, activityStatus) {
        const foundActivity = this.store.find(activity => activity.id === activityId);
        if (foundActivity && foundActivity.status !== activityStatus) {
            foundActivity.status = activityStatus;
            this.updateListener();
        }
    }
}
const projectStore = ProjectStore.getInstance();
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
    const { value, fieldName, customMessage, required, maxLength, minLength, max, min, trim, allowZero, unique, } = validateOptions;
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
    if (unique) {
        const foundItem = projectStore.getStore.find(item => item.title === value);
        const isValid = foundItem ? false : true;
        if (!isValid) {
            const message = customMessage
                ? customMessage
                : `A project with the title ${value}  already added. Ensure your (${capitalizeStr(fieldName)}) input value is unique.`;
            manageValidationBag({
                validationStatus: isValid,
                validationType: 'unique',
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
class Component {
    constructor(rootId, templateId, renderPosition = Insertable.BeforeEnd, componentId = '') {
        this.renderPosition = renderPosition;
        this.componentState = [];
        this.templateEl = document.getElementById(templateId);
        this.appRootEl = document.getElementById(rootId);
        const insertedDOMElement = document.importNode(this.templateEl.content, true);
        this.domEl = insertedDOMElement.firstElementChild;
        if (componentId)
            this.domEl.id = componentId;
        this.render();
    }
    render() {
        this.appRootEl.insertAdjacentElement(this.renderPosition, this.domEl);
    }
}
class ProjectItem extends Component {
    constructor(projectStatusId, projectItem) {
        super(projectStatusId, 'single-project', Insertable.BeforeEnd, projectItem.id);
        this.projectStatusId = projectStatusId;
        this.projectItem = projectItem;
        this.configDomElement();
        this.handleEvents();
    }
    get numOfPeopleDescription() {
        if (this.projectItem.noOfPeople > 1) {
            return `${this.projectItem.noOfPeople} persons assigned`;
        }
        return `Only ${this.projectItem.noOfPeople} person assigned`;
    }
    dragStartHandler(event) {
        event.dataTransfer.setData('text/plain', this.projectItem.id);
        event.dataTransfer.effectAllowed = 'move';
    }
    dragEndHandler(event) {
        var _a;
        (_a = this.domEl.parentElement) === null || _a === void 0 ? void 0 : _a.classList.remove('droppable');
    }
    configDomElement() {
        const titleContainerEl = this.domEl.querySelector('h2');
        const descriptionContainerEl = this.domEl.querySelector('p');
        const peopleContainerEl = this.domEl.querySelector('h3');
        titleContainerEl.innerText = this.projectItem.title;
        descriptionContainerEl.innerText = this.projectItem.description;
        peopleContainerEl.innerText = `${this.numOfPeopleDescription}`;
    }
    configureStore() { }
    handleEvents() {
        this.domEl.addEventListener('dragstart', this.dragStartHandler);
        this.domEl.addEventListener('dragend', this.dragEndHandler);
    }
}
__decorate([
    Autobind
], ProjectItem.prototype, "dragStartHandler", null);
__decorate([
    Autobind
], ProjectItem.prototype, "dragEndHandler", null);
class ProjectList extends Component {
    constructor(type = 'active') {
        super('app', 'project-list', Insertable.BeforeEnd, `${type}-projects`);
        this.type = type;
        this.configureStore();
        this.configDomElement();
        this.handleEvents();
    }
    dragOverHandler(event) {
        var _a;
        if (((_a = event.dataTransfer) === null || _a === void 0 ? void 0 : _a.types.at(0)) === 'text/plain') {
            event.preventDefault();
            this.domEl.lastElementChild.classList.add('droppable');
        }
    }
    dragLeaveHandler(event) {
        var _a;
        if (((_a = event.dataTransfer) === null || _a === void 0 ? void 0 : _a.types.at(0)) === 'text/plain') {
            event.preventDefault();
            this.domEl.lastElementChild.classList.remove('droppable');
        }
    }
    dropEventHandler(event) {
        var _a;
        if (((_a = event.dataTransfer) === null || _a === void 0 ? void 0 : _a.types.at(0)) === 'text/plain') {
            event.preventDefault();
            const getDraggedItemId = event.dataTransfer.getData('text/plain');
            let projectStatus = ProjectStatus.Active;
            if (ProjectStatus.Finished === this.type)
                projectStatus = ProjectStatus.Finished;
            projectStore.moveProjectItem(getDraggedItemId, projectStatus);
        }
        this.domEl.lastElementChild.classList.remove('droppable');
    }
    renderProjectItem() {
        const listEl = document.getElementById(`${this.type}-projects-list`);
        listEl.innerHTML = '';
        this.componentState.forEach(projectItem => {
            new ProjectItem(`${this.type}-projects-list`, projectItem);
        });
    }
    configureStore() {
        projectStore.addlistener((projectsInStore) => {
            const returnedProject = projectsInStore.filter(projectItem => {
                if (this.type === 'active') {
                    return projectItem.status === ProjectStatus.Active;
                }
                if (this.type === 'finished') {
                    return projectItem.status === ProjectStatus.Finished;
                }
            });
            this.componentState = returnedProject;
            this.renderProjectItem();
        });
    }
    configDomElement() {
        const listId = `${this.type}-projects-list`;
        this.domEl.querySelector('ul').id = listId;
        this.domEl.querySelector('h2').innerText = `${this.type.toLocaleUpperCase()} PROJECTS`;
    }
    handleEvents() {
        this.domEl.addEventListener('dragover', this.dragOverHandler);
        this.domEl.addEventListener('dragleave', this.dragLeaveHandler);
        this.domEl.addEventListener('drop', this.dropEventHandler);
    }
}
__decorate([
    Autobind
], ProjectList.prototype, "dragOverHandler", null);
__decorate([
    Autobind
], ProjectList.prototype, "dragLeaveHandler", null);
__decorate([
    Autobind
], ProjectList.prototype, "dropEventHandler", null);
class ProjectInputs extends Component {
    constructor() {
        super('app', 'project-input', Insertable.AfterBegin, 'user-input');
        this.titleInputValue = '';
        this.descriptionInputValue = '';
        this.peopleInputValue = '';
        this.handleEvents();
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
            unique: true,
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
            return;
        }
        return [enteredTitle, enteredDescription, enteredPeople];
    }
    handleFormSubmit(event) {
        event.preventDefault();
        const validatedInputs = this.getFormInputsAndValidate();
        if (Array.isArray(validatedInputs)) {
            const [title, description, people] = validatedInputs;
            const data = {
                title,
                description,
                noOfPeople: people,
            };
            projectStore.addPayload(data);
        }
    }
    handleEvents() {
        document.addEventListener('submit', this.handleFormSubmit);
    }
    configureStore() { }
    configDomElement() { }
}
__decorate([
    Autobind
], ProjectInputs.prototype, "handleFormSubmit", null);
new ProjectInputs();
new ProjectList('active');
new ProjectList('finished');
//# sourceMappingURL=app.js.map