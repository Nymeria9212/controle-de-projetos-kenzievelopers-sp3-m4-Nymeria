import { Client } from "pg";
import "dotenv/config";
import fs from "fs";

const startDatabaseTests = async (database: Client) => {
  await database.connect().catch((err: any) =>
    console.error({
      message: `Aconteceu um erro ${err.code}. Verifique se as variáveis de ambiente no seu '.env' estão corretas e se o database realmente existe.`,
      error: err.message,
    })
  );
};

const deleteTables = async (database: Client): Promise<void> => {
  const query: string = `
        DROP TABLE IF EXISTS 
            developers,
            developer_infos,
            projects,
            technologies,
            projects_technologies
        CASCADE;
        DROP TYPE IF EXISTS
            "OS"
        CASCADE;
    `;
  await database.query(query).catch((err: any) =>
    console.error({
      message: `Aconteceu um erro ${err.code}. Verifique se o nome das suas tabelas, chaves e relacionamentos estão de acordo com o solicitado na descrição da entrega.`,
      error: err.message,
    })
  );
};

const createTables = async (database: Client) => {
  const sql = fs.readFileSync("sql/createTables.sql").toString();
  await database.query(sql).catch((err: any) =>
    console.error({
      message: `Aconteceu um erro ${err.code}. Verifique se as querys de criação das tabelas em 'sql/createTables.sql' estão funcionais. E se o nome das suas tabelas, chaves e relacionamentos estão de acordo com o solicitado na descrição da entrega`,
      error: err.message,
    })
  );
};

const main = async (database: Client) => {
  await startDatabaseTests(database);
  await deleteTables(database);
  await createTables(database);
  database.end();
};

export { main };
