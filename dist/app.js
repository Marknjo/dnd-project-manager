"use strict";
class ProjectInputs {
    constructor() {
        this.templateEl = document.getElementById('project-input');
        this.appRootEl = document.getElementById('app');
        const importedDomEl = document.importNode(this.templateEl.content, true);
        this.domEl = importedDomEl.firstElementChild;
        this.domEl.id = 'user-input';
        this.render();
    }
    render() {
        this.appRootEl.insertAdjacentElement('afterbegin', this.domEl);
    }
}
const projects = new ProjectInputs();
//# sourceMappingURL=app.js.map