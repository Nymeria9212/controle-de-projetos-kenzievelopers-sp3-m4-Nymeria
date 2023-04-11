import app from "./app";
import { startDatabase } from "./database";

const appPort = process.env.APP_PORT || 3000 ;

const server = (port: number) =>
  app.listen(port, async () => {
    await startDatabase();
    console.log(`Server is running on port ${port}.`);
  });

if (process.env.NODE_ENV === "dev") {
  server(appPort);
}

export default server;
