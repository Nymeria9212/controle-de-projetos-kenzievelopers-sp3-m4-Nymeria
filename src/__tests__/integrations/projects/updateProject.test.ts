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
import {
  project1,
  project2,
  projectUpdate1,
  projectUpdate2,
  projectUpdateNotValidDeveloperId,
} from "../../mocks/projects.mock";

describe("PATCH - /projects/:id", () => {
  let serverTest: any;
  const databaseTests: Client = new Client({
    user: process.env.DB_TEST_USER,
    password: process.env.DB_TEST_PASSWORD,
    database: process.env.DB_TEST,
    host: process.env.DB_TEST_HOST,
    port: Number(process.env.DB_TEST_PORT),
  });
  beforeAll(async () => {
    serverTest = server(3010);
    await main(databaseTests);
  });

  afterAll(() => {
    serverTest.close();
  });

  it("Sucesso - Atualizando um projeto com sucesso.", async () => {
    const developer = await supertest(app).post("/developers").send(developer1);
    await supertest(app).post("/developers").send(developer2);

    const project = project1;
    project.developerId = developer.body.id;

    const projectResponse = await supertest(app)
      .post("/projects")
      .send(project);

    const response = await supertest(app)
      .patch(`/projects/${projectResponse.body.id}`)
      .send(projectUpdate1);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("name");
    expect(response.body).toHaveProperty("description");
    expect(response.body).toHaveProperty("estimatedTime");
    expect(response.body).toHaveProperty("repository");
    expect(response.body).toHaveProperty("startDate");
    expect(response.body).toHaveProperty("endDate");
    expect(response.body).toHaveProperty("developerId");
  });

  it("Falha - Tentando atualizar um projeto com um id de projeto inválido.", async () => {
    const response = await supertest(app)
      .patch(`/projects/${999}`)
      .send(projectUpdate2);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message");
  });

  it("Falha - Tentando atualizar um projeto com um developerId inválido.", async () => {
    const developer = await supertest(app).post("/developers").send(developer3);

    const project = project2;
    project.developerId = developer.body.id;
    const projectResponse = await supertest(app)
      .post("/projects")
      .send(project);

    const response = await supertest(app)
      .patch(`/projects/${projectResponse.body.id}`)
      .send(projectUpdateNotValidDeveloperId);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message");
  });
});
