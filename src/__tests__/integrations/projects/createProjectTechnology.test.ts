import { Client } from "pg";
import { main } from "../../../../configTestsDatabase";
import supertest from "supertest";
import app from "../../../app";
import server from "../../../server";
import {
  developer1,
  developer2,
  developer3,
} from "../../mocks/developers.mock";
import { project1, project2 } from "../../mocks/projects.mock";
import {
  technology1,
  technology2,
  technologyNotValid,
} from "../../mocks/projectTechnology.mock";

describe("POST - /projects/:id/technologies", () => {
  let serverTest: any;
  const databaseTests: Client = new Client({
    user: process.env.DB_TEST_USER,
    password: process.env.DB_TEST_PASSWORD,
    database: process.env.DB_TEST,
    host: process.env.DB_TEST_HOST,
    port: Number(process.env.DB_TEST_PORT),
  });
  beforeAll(async () => {
    serverTest = server(3006);
    await main(databaseTests);
  });

  afterAll(() => {
    serverTest.close();
  });

  it("Sucesso - Adicionando uma technology à um projeto com sucesso.", async () => {
    const developer = await supertest(app).post("/developers").send(developer1);

    const project = project1;
    project.developerId = developer.body.id;

    const projectResponse = await supertest(app)
      .post("/projects")
      .send(project);

    const response = await supertest(app)
      .post(`/projects/${projectResponse.body.id}/technologies`)
      .send(technology1);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("technologyId");
    expect(response.body).toHaveProperty("technologyName");
    expect(response.body).toHaveProperty("projectId");
    expect(response.body).toHaveProperty("projectName");
    expect(response.body).toHaveProperty("projectDescription");
    expect(response.body).toHaveProperty("projectEstimatedTime");
    expect(response.body).toHaveProperty("projectRepository");
    expect(response.body).toHaveProperty("projectStartDate");
    expect(response.body).toHaveProperty("projectEndDate");
  });

  it("Falha - Tentando adicionar uma technology à um projeto com id inválido.", async () => {
    const response = await supertest(app)
      .post(`/projects/999/technologies`)
      .send(technology2);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message");
  });

  it("Falha - Tentando adicionar uma technology inexistente à um projeto.", async () => {
    const developer = await supertest(app).post("/developers").send(developer2);

    const project = project2;
    project.developerId = developer.body.id;

    const projectResponse = await supertest(app)
      .post("/projects")
      .send(project);

    const response = await supertest(app)
      .post(`/projects/${projectResponse.body.id}/technologies`)
      .send(technologyNotValid);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
    expect(response.body).toHaveProperty("options");
    expect(Array.isArray(response.body.options)).toBe(true);
  });
  it("Falha - Tentando adicionar a mesma tecnologia ao projeto novamente.", async () => {
    const developer = await supertest(app).post("/developers").send(developer3);

    const project = project1;
    project.developerId = developer.body.id;

    const projectResponse = await supertest(app)
      .post("/projects")
      .send(project);

    await supertest(app)
      .post(`/projects/${projectResponse.body.id}/technologies`)
      .send(technology1);

    const response = await supertest(app)
      .post(`/projects/${projectResponse.body.id}/technologies`)
      .send(technology1);

    expect(response.status).toBe(409);
    expect(response.body).toHaveProperty("message");
  });
});
