import supertest from "supertest";
import { Client } from "pg";
import app from "../../../app";
import server from "../../../server";
import { main } from "../../../../configTestsDatabase";
import { developer1 } from "../../mocks/developers.mock";

describe("GET - /developers/:id", () => {
  let serverTest: any;
  const databaseTests: Client = new Client({
    user: process.env.DB_TEST_USER,
    password: process.env.DB_TEST_PASSWORD,
    database: process.env.DB_TEST,
    host: process.env.DB_TEST_HOST,
    port: Number(process.env.DB_TEST_PORT),
  });
  beforeAll(async () => {
    serverTest = server(3003);
    await main(databaseTests);
  });

  afterAll(() => {
    serverTest.close();
  });

  test("Sucesso - Listando dados de um usuário específico, mesclados com developer_infos e projects", async () => {
    const user = await supertest(app).post("/developers").send(developer1);

    const userId = user.body.id;

    const response = await supertest(app).get(`/developers/${userId}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("developerId");
    expect(response.body).toHaveProperty("developerName");
    expect(response.body).toHaveProperty("developerEmail");
    expect(response.body).toHaveProperty("developerInfoDeveloperSince");
    expect(response.body).toHaveProperty("developerInfoPreferredOS");
  });

  test("Falha - Tentando listar os dados de um usuário não cadastrado", async () => {
    const response = await supertest(app).get(`/developers/${999}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message");
  });
});
