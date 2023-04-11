import { Client } from "pg";
import { main } from "../../../../configTestsDatabase";
import supertest from "supertest";
import app from "../../../app";
import server from "../../../server";
import { developer1 } from "../../mocks/developers.mock";
import { project1, projectNotValidDeveloper } from "../../mocks/projects.mock";

describe("POST - /projects", () => {
  let serverTest: any;
  const databaseTests: Client = new Client({
    user: process.env.DB_TEST_USER,
    password: process.env.DB_TEST_PASSWORD,
    database: process.env.DB_TEST,
    host: process.env.DB_TEST_HOST,
    port: Number(process.env.DB_TEST_PORT),
  });
  beforeAll(async () => {
    serverTest = server(3005);
    await main(databaseTests);
  });

  afterAll(() => {
    serverTest.close();
  });

  it("Sucesso - Criando um projeto com sucesso.", async () => {
    const developer = await supertest(app).post("/developers").send(developer1);

    const project = project1;
    project.developerId = developer.body.id;

    const response = await supertest(app).post("/projects").send(project);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("name");
    expect(response.body).toHaveProperty("description");
    expect(response.body).toHaveProperty("estimatedTime");
    expect(response.body).toHaveProperty("repository");
    expect(response.body).toHaveProperty("startDate");
    expect(response.body).toHaveProperty("endDate");
    expect(response.body).toHaveProperty("developerId");
  });

  it("Falha - Tentando criar um projeto com developerId inválido.", async () => {
    const response = await supertest(app)
      .post("/projects")
      .send(projectNotValidDeveloper);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message");
  });
});
