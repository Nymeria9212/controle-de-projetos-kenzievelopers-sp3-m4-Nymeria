import { Client } from "pg";
import { main } from "../../../../configTestsDatabase";
import supertest from "supertest";
import app from "../../../app";
import server from "../../../server";
import { developer1 } from "../../mocks/developers.mock";
import { project1 } from "../../mocks/projects.mock";

describe("DELETE - /projects/:id", () => {
  let serverTest: any;
  const databaseTests: Client = new Client({
    user: process.env.DB_TEST_USER,
    password: process.env.DB_TEST_PASSWORD,
    database: process.env.DB_TEST,
    host: process.env.DB_TEST_HOST,
    port: Number(process.env.DB_TEST_PORT),
  });
  beforeAll(async () => {
    serverTest = server(3007);
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

    const response = await supertest(app).delete(
      `/projects/${projectResponse.body.id}`
    );

    const listResponse = await supertest(app).get(
      `/projects/${projectResponse.body.id}`
    );

    expect(listResponse.status).toBe(404);
    expect(response.status).toBe(204);
    expect(response.body).toStrictEqual({});
  });

  it("Falha - Tentando deletar um projeto com project id inválido.", async () => {
    const response = await supertest(app).get(`/projects/999`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message");
  });
});
