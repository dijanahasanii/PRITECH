import type { ApodData } from '../types/nasa';

export type RootStackParamList = {
  Home: undefined;
  AddTask: undefined;
  TaskDetails: { taskId: string };
  NASADetail: { apod: ApodData };
};
