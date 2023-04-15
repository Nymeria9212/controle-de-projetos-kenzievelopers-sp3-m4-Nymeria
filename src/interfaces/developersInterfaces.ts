export type TDeveloper = {
  id: number;
  name: string;
  email: string;
};

export type TDeveloperRequest = Omit<TDeveloper, "id">;

export type TDevAndInfos = {
  developerId: number;
  developerName: string;
  developerEmail: string;
  developerInfoDeveloperSince: Date | null;
  developerInfoPreferredOS: string | null;
};

export type TDevInfosReq = {
  developerSince: Date | null;
  preferedOS: "Windows" | "Linux" | "MacOS";
};

export type TDevInfosRes = {
  developerSince: Date | null;
  preferedOS: "Windows" | "Linux" | "MacOS";
  id: number;
  developerId: number;
};

export type TDevInfo = Omit<TDevInfosRes, "id">;
