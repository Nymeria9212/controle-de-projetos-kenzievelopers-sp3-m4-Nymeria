import { Request, Response } from "express";
import { TProject, TProjectResponse } from "../interfaces/projectsInterfaces";
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
  const project = response.locals.project;
  return response.status(200).json(project);
};

export { createProject, readProject };
