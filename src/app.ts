import express, { Application, json } from "express";
import "dotenv/config";
import {
  createDeveloper,
  createInfodev,
  deleteDeveloper,
  developerIdListen,
  updateDeveloper,
} from "./logic/developersLogic";
import {
  checkOS,
  checkOSExists,
  ensureDevID,
  ensureDeveloperDb,
} from "./middlewares/devMiddleware";
import {
  createProject,
  createTecProject,
  deleteProject,
  deleteTecProject,
  readProject,
  updateProjectId,
} from "./logic/projectsLogic";
import {
  checkTecProjectExists,
  checkTecProjectInsert,
  ensureDevInProject,
  ensureProjectId,
  tecId,
} from "./middlewares/projMiddleware";

const app: Application = express();
app.use(json());

app.post("/developers", ensureDeveloperDb, createDeveloper);
app.get("/developers/:id", ensureDevID, developerIdListen);
app.patch("/developers/:id", ensureDevID, ensureDeveloperDb, updateDeveloper);
app.delete("/developers/:id", ensureDevID, deleteDeveloper);
app.post(
  "/developers/:id/infos",
  ensureDevID,
  checkOS,
  checkOSExists,
  createInfodev
);

app.post("/projects", ensureDevInProject, createProject);
app.get("/projects/:id", ensureProjectId, readProject);
app.patch(
  "/projects/:id",
  ensureProjectId,
  ensureDevInProject,
  updateProjectId
);
app.delete("/projects/:id", ensureProjectId, deleteProject);
app.post(
  "/projects/:id/technologies",
  ensureProjectId,
  checkTecProjectInsert,
  tecId,
  checkTecProjectExists,
  createTecProject
);
app.delete(
  "/projects/:id/technologies/:name",
  ensureProjectId,
  tecId,
  checkTecProjectInsert,
  checkTecProjectExists,
  deleteTecProject
);

export default app;
