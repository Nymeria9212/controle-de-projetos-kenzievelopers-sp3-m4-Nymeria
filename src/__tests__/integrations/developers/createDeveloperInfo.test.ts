import supertest from "supertest";
import { Client } from "pg";
import { main } from "../../../../configTestsDatabase";
import app from "../../../app";
import server from "../../../server";
import {
  developer1,
  developer2,
  developer3,
} from "../../mocks/developers.mock";
import {
  developerInfo1,
  developerInfoNotAccepted,
} from "../../mocks/develiperInfo.mock";

describe("POST - /developers/:id/infos", () => {
  let serverTest: any;
  const databaseTests: Client = new Client({
    user: process.env.DB_TEST_USER,
    password: process.env.DB_TEST_PASSWORD,
    database: process.env.DB_TEST,
    host: process.env.DB_TEST_HOST,
    port: Number(process.env.DB_TEST_PORT),
  });
  beforeAll(async () => {
    serverTest = server(3001);
    await main(databaseTests);
  });

  afterAll(() => {
    serverTest.close();
  });

  it("Sucesso - Criando uma developerInfo com sucesso.", async () => {
    const user = await supertest(app).post("/developers").send(developer1);

    const userId = user.body.id;

    const response = await supertest(app)
      .post(`/developers/${userId}/infos`)
      .send(developerInfo1);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("developerSince");
    expect(response.body).toHaveProperty("preferredOS");
    expect(response.body).toHaveProperty("developerId");

    expect(response.body.developerId).toBe(userId);
    expect(response.body.preferredOS).toBe(developerInfo1.preferredOS);
    response.pause();
  });

  it("Falha - Tentando cadastrar uma informação à um usuário que já possui informação atrelada à ele.", async () => {
    const user = await supertest(app).post("/developers").send(developer2);

    const userId = user.body.id;

    await supertest(app)
      .post(`/developers/${userId}/infos`)
      .send(developerInfo1);

    const response = await supertest(app)
      .post(`/developers/${userId}/infos`)
      .send(developerInfo1);

    expect(response.status).toBe(409);
    expect(response.body).toHaveProperty("message");
  });

  it("Falha - Tentando cadastrar um preferedOS inválido", async () => {
    const user = await supertest(app).post("/developers").send(developer3);

    const userId = user.body.id;

    const response = await supertest(app)
      .post(`/developers/${userId}/infos`)
      .send(developerInfoNotAccepted);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
    expect(response.body).toHaveProperty("options");
    expect(Array.isArray(response.body.options)).toBe(true);
    expect(response.body.options.length).toBe(3);
  });

  it("Falha - Tentando cadastrar preferedOS a um usuário que não existe", async () => {
    const response = await supertest(app)
      .post(`/developers/999/infos`)
      .send(developerInfoNotAccepted);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message");
  });
});
