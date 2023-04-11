import supertest from "supertest";
import { Client } from "pg";
import app from "../../../app";
import server from "../../../server";
import { main } from "../../../../configTestsDatabase";
import { developer1 } from "../../mocks/developers.mock";

describe("DELETE - /developers/:id", () => {
  let serverTest: any;
  const databaseTests: Client = new Client({
    user: process.env.DB_TEST_USER,
    password: process.env.DB_TEST_PASSWORD,
    database: process.env.DB_TEST,
    host: process.env.DB_TEST_HOST,
    port: Number(process.env.DB_TEST_PORT),
  });
  beforeAll(async () => {
    serverTest = server(3002);
    await main(databaseTests);
  });

  afterAll(() => {
    serverTest.close();
  });

  test("Sucesso - Deletando um developer com sucesso.", async () => {
    const user = await supertest(app).post("/developers").send(developer1);

    const userId = user.body.id;

    const response = await supertest(app).delete(`/developers/${userId}`);
    const listResponse = await supertest(app).get(`/developers/${userId}`);

    expect(listResponse.status).toBe(404);
    expect(response.status).toBe(204);
    expect(response.body).toStrictEqual({});
  });

  test("Falha - Tentando deletar um developer que não existe.", async () => {
    const response = await supertest(app).delete(`/developers/${999}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message");
  });
});
