import { Client } from "pg";
import { main } from "../../../../configTestsDatabase";
import supertest from "supertest";
import app from "../../../app";
import server from "../../../server";
import { developer1 } from "../../mocks/developers.mock";

describe("POST - /developers", () => {
  let serverTest: any;
  const databaseTests: Client = new Client({
    user: process.env.DB_TEST_USER,
    password: process.env.DB_TEST_PASSWORD,
    database: process.env.DB_TEST,
    host: process.env.DB_TEST_HOST,
    port: Number(process.env.DB_TEST_PORT),
  });
  beforeAll(async () => {
    serverTest = server(3000);
    await main(databaseTests);
  });

  afterAll(() => {
    serverTest.close();
  });

  it("Sucesso - Criando um developer com sucesso.", async () => {
    const response = await supertest(app).post("/developers").send(developer1);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("name");
    expect(response.body).toHaveProperty("email");
  });

  it("Falha - Criando um developer com email já cadastrado.", async () => {
    const response = await supertest(app).post("/developers").send(developer1);

    expect(response.status).toBe(409);
    expect(response.body).toHaveProperty("message");
  });
});
