const project1 = {
  name: "Projeto 1",
  description: "Projeto fullstack",
  estimatedTime: "2 dias",
  repository: "url.com.br",
  startDate: "2023-03-01",
  developerId: 1,
};

const project2 = {
  name: "Projeto 2",
  description: "Projeto backend",
  estimatedTime: "2 dias",
  repository: "url.com.br",
  startDate: "2023-02-01",
  developerId: 1,
};

const projectNotValidDeveloper = {
  name: "Projeto 3",
  description: "Projeto front-end",
  estimatedTime: "7 dias",
  repository: "url2.com.br",
  startDate: "2023-01-01",
  developerId: 488,
};

const projectUpdate1 = {
  name: "Novo nome",
  description: "Nova descrição",
  estimatedTime: "1 dia",
  repository: "novaurl.com.br",
  startDate: "2022-11-20",
  developerId: 2,
};

const projectUpdate2 = {
  name: "Novo nome 2",
  description: "Nova descrição 2",
  estimatedTime: "2 dias",
  repository: "novaurl2.com.br",
  startDate: "2023-01-01",
  developerId: 1,
};

const projectUpdateNotValidDeveloperId = {
  developerId: 4521,
};

export {
  project1,
  project2,
  projectNotValidDeveloper,
  projectUpdate1,
  projectUpdate2,
  projectUpdateNotValidDeveloperId,
};
