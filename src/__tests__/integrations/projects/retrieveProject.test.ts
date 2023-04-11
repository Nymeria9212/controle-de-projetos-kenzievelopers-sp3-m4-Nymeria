import { Client } from "pg";
import { main } from "../../../../configTestsDatabase";
import supertest from "supertest";
import app from "../../../app";
import server from "../../../server";
import { developer1 } from "../../mocks/developers.mock";
import { project1 } from "../../mocks/projects.mock";
import { technology1 } from "../../mocks/projectTechnology.mock";

describe("GET - /projects/:id", () => {
  let serverTest: any;
  const databaseTests: Client = new Client({
    user: process.env.DB_TEST_USER,
    password: process.env.DB_TEST_PASSWORD,
    database: process.env.DB_TEST,
    host: process.env.DB_TEST_HOST,
    port: Number(process.env.DB_TEST_PORT),
  });
  beforeAll(async () => {
    serverTest = server(3009);
    await main(databaseTests);
  });

  afterAll(() => {
    serverTest.close();
  });

  it("Sucesso - Listando dados de um projeto específico.", async () => {
    const developer = await supertest(app).post("/developers").send(developer1);

    const project = project1;
    project.developerId = developer.body.id;

    const projectResponse = await supertest(app)
      .post("/projects")
      .send(project);

    await supertest(app)
      .post(`/projects/${projectResponse.body.id}/technologies`)
      .send(technology1);

    const response = await supertest(app).get(
      `/projects/${projectResponse.body.id}`
    );

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body[0]).toHaveProperty("projectId");
    expect(response.body[0]).toHaveProperty("projectName");
    expect(response.body[0]).toHaveProperty("projectDescription");
    expect(response.body[0]).toHaveProperty("projectEstimatedTime");
    expect(response.body[0]).toHaveProperty("projectRepository");
    expect(response.body[0]).toHaveProperty("projectStartDate");
    expect(response.body[0]).toHaveProperty("projectEndDate");
    expect(response.body[0]).toHaveProperty("projectDeveloperId");
    expect(response.body[0]).toHaveProperty("technologyId");
    expect(response.body[0]).toHaveProperty("technologyName");
  });

  it("Falha - Tentando listar um projeto com developerId inválido.", async () => {
    const response = await supertest(app).get(`/projects/999`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message");
  });
});
