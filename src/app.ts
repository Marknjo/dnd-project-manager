// Import CSS
import './app.css';

import ProjectStages from './components/projectStage';
import ActivityForm from './components/activityForm';
import { ProjectStageStatus } from './types/projectEnums';

// App Code

// @TARGETS: General App Overview
// @DONE: #01. Add Project Form To the UI
// @DONE: #02. Add Project Lists to the UI (Actvities && Finished)
// @DONE: #03. Add A single Project to the screen
// @DONE: #04. Enable Drag and Drop of the Activities from one project Status i.e. Activities to finished and Vice Versa
// @DONE: #05. Refactor code to organized Folders
// @DONE: #06. Validate Project UI
// @DONE: #07. Manage Project State
// @DONE: #08. Refactor Templating to Component - With State and Without State

/// Initialize activity Form
new ActivityForm();

/// Add project Status Stages to the UI
new ProjectStages(ProjectStageStatus.Stalled);
new ProjectStages(ProjectStageStatus.Finished);
new ProjectStages(ProjectStageStatus.InProgress);
new ProjectStages(ProjectStageStatus.Activities);
