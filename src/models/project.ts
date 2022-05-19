import { ProjectStageStatus } from '../types/projectEnums';

/**
 * Define Project Structure
 */
class Project {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public noOfPeople: number,
    public projectStage: ProjectStageStatus
  ) {}
}

export default Project;
