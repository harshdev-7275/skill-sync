export interface UserProgress {
    percentage: number;
    lastSession: string;
    completedModules: string[];
    currentTopic: string;
    nextMilestone: string;
    eta: string;
  }


export type Modules = {
    moduleName: string;
    moduleDescription: string;
}