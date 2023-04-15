import express, { Application, json } from "express";
import "dotenv/config";
import {
  createDeveloper,
  createInfodev,
  deleteDeveloper,
  developerIdListen,
  updateDeveloper,
} from "./logic/developersLogic";
import { ensureDevID, ensureDeveloperDb } from "./middlewares/devMiddleware";
import { createProject, readProject } from "./logic/projectsLogic";
import { ensureProjectId } from "./middlewares/projMiddleware";

const app: Application = express();
app.use(json());

app.post("/developers", ensureDeveloperDb, createDeveloper);
app.get("/developers/:id", ensureDevID, developerIdListen);
app.patch("/developers/:id", ensureDeveloperDb, ensureDevID, updateDeveloper);
app.delete("/developers/:id", deleteDeveloper);
app.post("/developers/:id/infos", ensureDevID, createInfodev);

app.post("/projects", createProject);
app.get("/projects/:id", ensureProjectId, readProject);
app.patch("/projects/:id");
app.delete("/projects/:id");
app.post("/projects/:id/technologies");
app.delete("/projects/:id/technologies/:name");

export default app;
