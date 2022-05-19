/** ------------------------------------------------- */
//                    ENUMS TYPES                     //
/** ------------------------------------------------- */

/**
 * Html Element Insert Position
 */
enum InsertPosition {
  AfterBegin = 'afterbegin',
  AfterEnd = 'afterend',
  BeforeBegin = 'beforebegin',
  BeforeEnd = 'beforeend',
}

/**
 * Defines Different project stages status
 */
enum ProjectStageStatus {
  Activities = 'activities',
  InProgress = 'in-progress',
  Finished = 'finished',
  Stalled = 'stalled',
}

export { ProjectStageStatus, InsertPosition };
