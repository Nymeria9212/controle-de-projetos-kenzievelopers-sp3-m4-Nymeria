export type TProject = {
  name: string;
  description: string;
  estimatedTime: string;
  repository: string;
  startDate: Date;
  developerId: number;
};

export type TProjectResponse = {
  id: number;
  name: string;
  description: string;
  estimatedTime: string;
  repository: string;
  startDate: Date;
  endDate: Date | null;
  developerId: number;
};
