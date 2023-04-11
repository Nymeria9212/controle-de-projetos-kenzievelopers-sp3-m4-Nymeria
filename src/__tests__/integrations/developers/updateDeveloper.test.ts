import supertest from "supertest";
import { Client } from "pg";
import app from "../../../app";
import server from "../../../server";
import { main } from "../../../../configTestsDatabase";
import {
  developer1,
  developer2,
  developerUpdate1,
} from "../../mocks/developers.mock";

describe("PATCH - /developers/:id", () => {
  let serverTest: any;
  const databaseTests: Client = new Client({
    user: process.env.DB_TEST_USER,
    password: process.env.DB_TEST_PASSWORD,
    database: process.env.DB_TEST,
    host: process.env.DB_TEST_HOST,
    port: Number(process.env.DB_TEST_PORT),
  });
  beforeAll(async () => {
    serverTest = server(3004);
    await main(databaseTests);
  });

  afterAll(() => {
    serverTest.close();
  });

  test("Sucesso - Atualizando um developer com sucesso.", async () => {
    const user = await supertest(app).post("/developers").send(developer1);

    const userId = user.body.id;

    const response = await supertest(app)
      .patch(`/developers/${userId}`)
      .send(developerUpdate1);

    expect(response.status).toBe(200);
    expect(response.body.email).toBe(developerUpdate1.email);
  });

  test("Falha - Tentando atualizar um developer com email já cadastrado.", async () => {
    const user = await supertest(app).post("/developers").send(developer2);

    const userId = user.body.id;

    const response = await supertest(app)
      .patch(`/developers/${userId}`)
      .send(developerUpdate1);

    expect(response.status).toBe(409);
    expect(response.body).toHaveProperty("message");
  });

  test("Falha - Tentando atualizar um developer que não existe.", async () => {
    const response = await supertest(app)
      .patch(`/developers/${999}`)
      .send(developerUpdate1);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message");
  });
});
