import Project from '../models/project';

/**
 * Define Project Listener Function
 */
type Listener = (store: Project[]) => void;

/** ------------------------------------------------- */
//                  INTERFACE TYPES                   //
/** ------------------------------------------------- */

/**
 * Interface to validate input field
 */
interface Validatable {
  field: string;
  value: string | number;
  trim?: boolean;
  message?: string;
  require?: boolean;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
}

/**
 * Validation Message Interface
 */
interface ValidatableMessages {
  isValid: boolean;
  message: string;
  field: string;
}

/**
 * Describes activity for submitted data
 */
interface ProjectPayload {
  title: string;
  description: string;
  noOfPeople: number;
}

export type { Listener, Validatable, ValidatableMessages, ProjectPayload };
