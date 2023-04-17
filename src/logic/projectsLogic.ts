import { Request, Response } from "express";
import {
  TProject,
  TProjectResponse,
  TTecnology,
} from "../interfaces/projectsInterfaces";
import format from "pg-format";
import { QueryConfig, QueryResult } from "pg";
import { client } from "../database";

const createProject = async (
  request: Request,
  response: Response
): Promise<Response<TProjectResponse>> => {
  const dataProj: TProject = request.body;

  const queryString: string = format(
    `
        INSERT INTO 
            projects (%I)
        VALUES
            (%L)
        RETURNING*;
    `,
    Object.keys(dataProj),
    Object.values(dataProj)
  );

  const queryResult: QueryResult<TProjectResponse> = await client.query(
    queryString
  );

  return response.status(201).json(queryResult.rows[0]);
};

const readProject = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const id: number = parseInt(request.params.id);

  const queryString: string = `
        SELECT 
            p.id "projectId",
            p."name" "projectName", 
            p."description" "projectDescription",
            p."estimatedTime" "projectEstimatedTime",
            p."repository" "projectRepository",
            p."startDate" "projectStartDate",
            p."endDate" "projectEndDate",
            p."developerId" "projectDeveloperId",
            pt."technologyId" "technologyId",
            t."name" "technologyName" 
        FROM 
            projects as p
        FULL JOIN 
            projects_technologies as pt 
        ON
            p.id = pt."projectId" 
        FULL JOIN technologies as t 
        ON 
            pt."technologyId" = t.id 
        WHERE 
            p.id =$1;
  `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: QueryResult = await client.query(queryConfig);
  return response.status(200).json(queryResult.rows[0]);
};

const updateProjectId = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const id: number = parseInt(request.params.id);
  const body: Partial<TProject> = request.body;

  const queryString: string = format(
    `
  UPDATE 
      projects p
  SET 
      (%I)=(%L)
  WHERE 
      p.id =$1
  RETURNING *;
`,
    Object.keys(body),
    Object.values(body)
  );

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: QueryResult<Partial<TProject>> = await client.query(
    queryConfig
  );
  return response.status(200).json(queryResult.rows[0]);
};

const deleteProject = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const id: number = parseInt(request.params.id);

  const queryString: string = `
        DELETE  
        FROM 
            projects 
        WHERE 
            id=$1;
  `;
  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: QueryResult = await client.query(queryConfig);

  return response.status(204).json();
};

const createTecProject = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const idProject: number = parseInt(request.params.id);
  const { name } = request.body;
  const id = response.locals.tecId;
  const newData = new Date();

  const queryStringTec: string = `
        INSERT INTO 
            projects_technologies 
            ("addedIn","technologyId","projectId")
        VALUES ($1,$2,$3)
        RETURNING *;
  `;

  const queryConfigTec: QueryConfig = {
    text: queryStringTec,
    values: [newData, id.id, idProject],
  };

  const queryResultTec: QueryResult = await client.query(queryConfigTec);

  const queryStringData: string = `
        SELECT
              pt."technologyId",
              p.description "projectDescription",
              p."estimatedTime" "projectEstimatedTime",
              p.repository "projectRepository",
              p."startDate" "projectStartDate",
              p."endDate" "projectEndDate"
              FROM 
              projects p 
        FULL JOIN 
              projects_technologies pt 
        ON
              p.id =pt."projectId" 
        FULL JOIN 
              technologies t 
        ON t.id =pt."technologyId"
        WHERE p.id =$1;
  `;

  const queryConfigData: QueryConfig = {
    text: queryStringData,
    values: [idProject],
  };
  const queryResultData: QueryResult = await client.query(queryConfigData);

  return response.status(201).json({
    technologyName: name,
    projectId: idProject,
    ...queryResultData.rows[0],
  });
};

const deleteTecProject = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const id: number = parseInt(request.params.id);
  const tec = response.locals.nameTec;

  const queryString: string = `
      DELETE FROM
          projects_technologies pt
      WHERE 
          pt."projectId" =$1 
      AND 
          pt."technologyId"=$2;
  `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id, tec.id],
  };

  const queryResult: QueryResult = await client.query(queryConfig);
  return response.status(204).json();
};
export {
  createProject,
  readProject,
  updateProjectId,
  deleteProject,
  createTecProject,
  deleteTecProject,
};
