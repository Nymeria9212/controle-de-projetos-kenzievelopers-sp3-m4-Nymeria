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
  technologyNotValid,
} from "../../mocks/projectTechnology.mock";

describe("DELETE - /projects/:id/technologies/:name", () => {
  let serverTest: any;
  const databaseTests: Client = new Client({
    user: process.env.DB_TEST_USER,
    password: process.env.DB_TEST_PASSWORD,
    database: process.env.DB_TEST,
    host: process.env.DB_TEST_HOST,
    port: Number(process.env.DB_TEST_PORT),
  });
  beforeAll(async () => {
    serverTest = server(3008);
    await main(databaseTests);
  });

  afterAll(() => {
    serverTest.close();
  });

  it("Sucesso - Deletando uma tecnologia de um projeto.", async () => {
    const developer = await supertest(app).post("/developers").send(developer1);

    const project = project1;
    project.developerId = developer.body.id;

    const projectResponse = await supertest(app)
      .post("/projects")
      .send(project);

    await supertest(app)
      .post(`/projects/${projectResponse.body.id}/technologies`)
      .send(technology1);

    const response = await supertest(app).delete(
      `/projects/${projectResponse.body.id}/technologies/${technology1.name}`
    );

    expect(response.status).toBe(204);
    expect(response.body).toStrictEqual({});
  });

  it("Falha - Tentando deletar uma tecnologia com project id inválido.", async () => {
    const response = await supertest(app).delete(
      `/projects/999/technologies/${technology1.name}`
    );

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message");
  });

  it("Falha - Tentando deletar uma tecnologia não cadastrada ao projeto informado.", async () => {
    const developer = await supertest(app).post("/developers").send(developer2);

    const project = project2;
    project.developerId = developer.body.id;

    const projectResponse = await supertest(app)
      .post("/projects")
      .send(project);

    const response = await supertest(app).delete(
      `/projects/${projectResponse.body.id}/technologies/${technology1.name}`
    );

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
  });

  it("Falha - Tentando deletar uma tecnologia com um nome inválido.", async () => {
    const developer = await supertest(app).post("/developers").send(developer3);

    const project = project2;
    project.developerId = developer.body.id;

    const projectResponse = await supertest(app)
      .post("/projects")
      .send(project);

    const response = await supertest(app).delete(
      `/projects/${projectResponse.body.id}/technologies/${technologyNotValid.name}`
    );

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
    expect(response.body).toHaveProperty("options");
    expect(Array.isArray(response.body.options)).toBe(true);
  });
});
